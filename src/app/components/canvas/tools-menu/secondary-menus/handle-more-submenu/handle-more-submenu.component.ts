import { AfterViewInit, Component, OnInit, ElementRef, Input, Renderer2 } from '@angular/core';
import { SVGLoaderService } from '~components/services/images/SVGLoader.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CanvasManagerService } from '~components/canvas/services/canvas-manager.service';
import { fabric } from 'fabric';
import { SvgFile } from '~components/services/images/svg-file.interface';

@Component({
    selector: 'app-handle-more-submenu',
    templateUrl: './handle-more-submenu.component.html',
    styleUrls: ['./handle-more-submenu.component.scss']
})
export class HandleMoreSubmenuComponent implements OnInit, AfterViewInit {
    svgFiles: SvgFile[] = [];
    searchTerm = '';
    get filteredSvgFiles() {
        const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
        return this.svgFiles
            .filter((svgFile) => svgFile.name.toLowerCase().includes(lowerCaseSearchTerm))
            .sort((a, b) => a.name.localeCompare(b.name));
    }
    @Input() currentIndex!: number;
    @Input() positionY!: number;
    @Input() toolsMenuHeight!: number;

    constructor(
        // eslint-disable-next-line no-unused-vars
        private elementRef: ElementRef,
        // eslint-disable-next-line no-unused-vars
        private svgLoader: SVGLoaderService,
        // eslint-disable-next-line no-unused-vars
        private sanitizer: DomSanitizer,
        // eslint-disable-next-line no-unused-vars
        private canvasManagerService: CanvasManagerService,
        // eslint-disable-next-line no-unused-vars
        private renderer: Renderer2
    ) {}

    // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.verticallyCentralize();
    }

    verticallyCentralize() {
        const submenuElement = this.elementRef.nativeElement.querySelector('.submenu');
        if (submenuElement) {
            const optionsMenu = submenuElement.parentElement.parentElement;
            const submenuHeight = optionsMenu.offsetHeight;

            if (this.positionY !== undefined) {
                const offset = -submenuHeight / 2 - 90;
                const verticalPos = this.positionY + submenuHeight / 2 - this.toolsMenuHeight / 2 + offset;

                this.renderer.setStyle(optionsMenu, 'top', `${verticalPos}px`);
            }
        } else {
            console.error('nothing found');
        }
    }

    changingThisToTrustedResourceUrl(url: SafeResourceUrl) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url as string);
    }

    insertShape(name: string) {
        const url = './assets/icons/svg/tools-menu-more/' + name + '.svg';

        fabric.loadSVGFromURL(url, (objects, options) => {
            const svgObject = fabric.util.groupSVGElements(objects, options);

            svgObject.set({
                left: 100,
                top: 100,
                fill: 'blue'
            });

            if (svgObject) {
                CanvasManagerService.canvas?.add(svgObject);
                CanvasManagerService.canvas?.renderAll();
            } else {
                console.error('No shape.');
            }
        });
    }

    onSvgClick(svgName: string): void {
        console.log(`Clicked on SVG: ${svgName}`);
        this.insertShape(svgName.toLowerCase());
    }
}
