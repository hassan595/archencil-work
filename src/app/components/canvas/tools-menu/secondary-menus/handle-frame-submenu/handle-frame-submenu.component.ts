import { AfterViewInit, Component, OnInit, ElementRef, Renderer2, Input } from '@angular/core';
import { SVGLoaderService } from '~components/services/images/SVGLoader.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CanvasManagerService } from '~components/canvas/services/canvas-manager.service';
import { fabric } from 'fabric';
import { SvgFile } from '~components/services/images/svg-file.interface';

@Component({
    selector: 'app-handle-frame-submenu',
    templateUrl: './handle-frame-submenu.component.html',
    styleUrls: ['./handle-frame-submenu.component.scss']
})
export class HandleFrameSubmenuComponent implements OnInit, AfterViewInit {
    svgFiles: SvgFile[] = [];
    @Input() currentIndex!: number;
    @Input() positionY!: number;
    @Input() toolsMenuHeight!: number;

    // eslint-disable-next-line no-unused-vars
    constructor(
        // eslint-disable-next-line no-unused-vars
        private svgLoader: SVGLoaderService,
        // eslint-disable-next-line no-unused-vars
        private sanitizer: DomSanitizer,
        // eslint-disable-next-line no-unused-vars
        private canvasManagerService: CanvasManagerService,
        // eslint-disable-next-line no-unused-vars
        private renderer: Renderer2,
        // eslint-disable-next-line no-unused-vars
        private elementRef: ElementRef
    ) {}

    // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
    ngOnInit(): void {}

    // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
    ngAfterViewInit(): void {
        this.verticallyCentralize();
    }

    changingThisToTrustedResourceUrl(url: SafeResourceUrl) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url as string);
    }

    insertShape(name: string) {
        const url = './assets/icons/svg/tools-menu-shapes/' + name + '.svg';

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

        switch (svgName) {
            case 'Custom':
                this.insertShape('connection-line-1');
                break;
            case 'A4':
                this.insertShape('connection-line-2');
                break;
            case 'Letter':
                this.insertShape('connection-line-3');
                break;
            case '16:9':
                this.insertShape('connection-line-1');
                break;
            case '4:3':
                this.insertShape('connection-line-2');
                break;
            case '1:1':
                this.insertShape('connection-line-3');
                break;
            default:
                console.log(`Shape ${svgName} not supported`);
        }
    }

    allShapesClicked(): void {
        console.log('All shapes clicked');
    }

    verticallyCentralize() {
        const submenuElement = this.elementRef.nativeElement.querySelector('.submenu');
        if (submenuElement) {
            const optionsMenu = submenuElement.parentElement.parentElement;
            const submenuHeight = optionsMenu.offsetHeight;
            //console.log('Offset Height:', submenuHeight);

            if (this.positionY !== undefined) {
                const offset = -submenuHeight / 2 + 10;
                const verticalPos = this.positionY + submenuHeight / 2 - this.toolsMenuHeight / 2 + offset;
                //const verticalPos = elementHeight;
                //console.log('this.positionY', this.positionY);

                this.renderer.setStyle(optionsMenu, 'top', `${verticalPos}px`);
                //this.renderer.setStyle(optionsMenu, 'transform', `translateY(0)`);
                //console.log('toolsMenuHeight', this.toolsMenuHeight);
            }
        } else {
            console.error('nothing found');
        }
    }
}
