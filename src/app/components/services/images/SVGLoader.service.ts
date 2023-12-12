import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnDestroy, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, of, forkJoin, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { catchError, map, takeUntil } from 'rxjs/operators';
import { SafeResourceUrl } from '@angular/platform-browser';


const DEFAULT_SVG_FOLDER = './assets/icons/svg/';

type SvgFilePaths = {
    [key: string]: string[]; // This is the index signature required.
};

@Injectable({
    providedIn: 'root'
})
export class SVGLoaderService implements OnDestroy {
    private svgCache = new Map<string, SafeResourceUrl>();
    private unsubscribe$ = new Subject();

    constructor(
        // eslint-disable-next-line no-unused-vars
        private http: HttpClient,
        // eslint-disable-next-line no-unused-vars
        private sanitizer: DomSanitizer
    ) {}

    preloadSVGs(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.http.get<{ images: string[] }>(`${DEFAULT_SVG_FOLDER}svg-files.json`).pipe(
                switchMap(filePaths => {
                    const svgPaths = filePaths.images.map(path => `${DEFAULT_SVG_FOLDER}${path}`);
                    const svgObservables = svgPaths.map(path => this.loadSVG(path));
                    return forkJoin(svgObservables);
                }),
                takeUntil(this.unsubscribe$)
            ).subscribe({
                next: () => resolve(),
                error: (err) => reject(err)
            });
        });
    }

    loadSVG(src: string): Observable<SafeResourceUrl> {
        if (this.svgCache.has(src)) {
            // Use the non-null assertion operator to tell TypeScript that the value will always be defined
            return of(this.svgCache.get(src)!);
        } else {
            return this.http.get(src, { responseType: 'text' }).pipe(
                map((svg) => {
                    const safeSvg = this.sanitizer.bypassSecurityTrustResourceUrl(
                        'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
                    );
                    this.svgCache.set(src, safeSvg);
                    return safeSvg;
                }),
                catchError((error) => {
                    console.warn(`Couldn't load SVG from ${src}: ${error.message}`);
                    // Return an empty, safe SVG if there's an error
                    return of(this.sanitizer.bypassSecurityTrustResourceUrl(''));
                })
            );
        }
    }

    loadSvgIcon(path: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.http.get(path, { responseType: 'text' }).subscribe(
                (data) => {
                    resolve(`data:image/svg+xml;utf8,${encodeURIComponent(data)}`);
                },
                (error: HttpErrorResponse) => {
                    console.error('Error fetching SVG icon:', error.message);
                    reject(error);
                }
            );
        });
    }

    getSVGImage(name: string): Observable<SafeResourceUrl> {
        const completePath = `${DEFAULT_SVG_FOLDER}${name}.svg`;
        return this.loadSVG(completePath).pipe(
            map((safeSvg) => {
                const sanitizedSvg = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, safeSvg);
                if (sanitizedSvg === null) {
                    // Handle the null case, perhaps throw an error or return a default value
                    throw new Error('Unsafe SVG cannot be used');
                }
                return sanitizedSvg as SafeResourceUrl; // Cast is safe here since we checked for null
            }),
            catchError((error) => {
                // Handle the error, return an empty observable, or a default SafeResourceUrl
                console.error('Error sanitizing SVG:', error);
                return of(this.sanitizer.bypassSecurityTrustResourceUrl('')); // or EMPTY if you prefer to return an empty observable
            })
        );
    }

    getSVGFiles(files: Array<{ name: string; width: string; height: string; label: string }>): Observable<any[]> {
        const svgFileObservables = files.map((file) => {
            return this.getSVGImage(file.name).pipe(
                map((safeSvg) => ({
                    path: safeSvg,
                    width: file.width,
                    height: file.height,
                    name: file.name,
                    label: file.label
                }))
            );
        });

        return forkJoin(svgFileObservables).pipe(takeUntil(this.unsubscribe$));
    }

    ngOnDestroy(): void {
        this.unsubscribe$.complete();
    }
}
