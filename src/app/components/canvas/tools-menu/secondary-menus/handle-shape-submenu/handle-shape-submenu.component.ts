import { AfterViewInit, Component, OnInit, ElementRef, Renderer2, Input } from '@angular/core';
import { SVGLoaderService } from '~components/services/images/SVGLoader.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CanvasManagerService } from '~components/canvas/services/canvas-manager.service';
import { fabric } from 'fabric';
import { SvgFile } from '~components/services/images/svg-file.interface';

@Component({
    selector: 'app-handle-shape-submenu',
    templateUrl: './handle-shape-submenu.component.html',
    styleUrls: ['./handle-shape-submenu.component.scss']
})
export class HandleShapeSubmenuComponent implements OnInit, AfterViewInit {
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

        // Adjust the type based on actual exported types from @types/fabric
        fabric.loadSVGFromURL(url, (objects: fabric.Object[], options: fabric.IToSVGOptions) => {
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
            case 'square':
                this.insertShape('square');
                break;
            case 'rounded-square':
                this.insertShape('stop-button');
                break;
            case 'circle':
                this.insertShape('circle');
                break;
            case 'triangle':
                this.insertShape('triangle');
                break;
            case 'right-arrow': {
                this.insertShape('right-align');
                break;
            }
            case 'left-arrow': {
                this.insertShape('right-align-1');
                break;
            }
            case 'left-and-right-arrow': {
                this.insertShape('left-and-right-arrows');
                break;
            }
            case 'pentagon': {
                this.insertShape('pentagon');
                break;
            }
            case 'octagon': {
                this.insertShape('octagon');
                break;
            }
            case 'hexagon': {
                this.insertShape('hexagon');
                break;
            }
            case 'trapezoid': {
                this.insertShape('trapezoid');
                break;
            }
            case 'plus': {
                this.insertShape('pharmacy');
                break;
            }
            case 'rhombus': {
                this.insertShape('rhombus');
                break;
            }
            case 'parallelogram': {
                this.insertShape('rhombus-1');
                break;
            }
            case 'pill': {
                this.insertShape('round');
                break;
            }
            case 'star': {
                this.insertShape('star');
                break;
            }
            case 'concave-square': {
                this.insertShape('polygon');
                break;
            }
            case 'open-bracket': {
                this.insertShape('open-bracket');
                break;
            }
            case 'close-bracket': {
                this.insertShape('close-bracket');
                break;
            }
            case 'cloud': {
                this.insertShape('weather');
                break;
            }
            case 'conversation-bubble': {
                this.insertShape('conversation');
                break;
            }
            // More case statements for each SVG...
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
                const offset = -submenuHeight + 100;
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
