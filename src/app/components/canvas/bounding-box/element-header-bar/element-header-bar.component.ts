import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    OnChanges,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import { CanvasManagerService } from '~components/canvas/services/canvas-manager.service';
import { fabric } from 'fabric';
import { SharedService } from './services/element-header-bar.service';

@Component({
    selector: 'app-element-header-bar',
    templateUrl: './element-header-bar.component.html',
    styleUrls: ['./element-header-bar.component.scss']
})
export class ElementHeaderBarComponent implements OnChanges, OnInit, AfterViewInit {
    @HostBinding('style.top.px') top = 0;
    @HostBinding('style.left.px') left = 0;
    @HostBinding('style.visibility') visibility = 'hidden'; // Changed
    @HostBinding('style.display') display = 'block'; // Always block
    @ViewChild('headerBar', { static: false }) headerBar!: ElementRef;

    @Output() headerBarChange = new EventEmitter<void>();

    headerSpacing: number = 50; // How tall

    showFontControls = false;
    showColorControls = false;
    showSizeControls = false;
    showLockControl = true;
    showCommentControl = true;

    zoomTimer: any = null;

    isZoomChanged = false;

    isBeingModified = false;

    get headerBarElement(): HTMLElement {
        return this.headerBar?.nativeElement;
    }

    constructor(
        private canvasManagerService: CanvasManagerService,
        private changeDetectorRef: ChangeDetectorRef,
        private sharedService: SharedService
    ) {}

    ngOnInit() {
        //console.log('Header bar started.');

        if (CanvasManagerService.canvas) {
            CanvasManagerService.canvas.on('mouse:wheel', (opt: any) => {
                const zoomVal = CanvasManagerService.canvas?.getZoom();
                if (!zoomVal) {
                    console.error('zoomVal is undefined.');
                    return;
                }
                if (zoomVal !== zoomVal + opt.e.deltaY / 300) {
                    this.isZoomChanged = true;
                    this.setBeingModified(true);
                    if (this.zoomTimer) {
                        clearTimeout(this.zoomTimer);
                    }
                    this.zoomTimer = setTimeout(() => {
                        this.setBeingModified(false);
                    }, 100); // adjust this delay as needed
                }
            });

            CanvasManagerService.canvas.on('after:render', () => {
                // If zoom has changed, update the position
                if (this.isZoomChanged) {
                    this.updatePosition();
                    this.isZoomChanged = false; // Reset the flag
                }
            });
            CanvasManagerService.canvas.on('object:moving', () => {
                //console.log('object:moving triggered');
                this.setBeingModified(true);
            });
            CanvasManagerService.canvas.on('object:scaling', () => {
                //console.log('object:scaling triggered');
                this.setBeingModified(true);
            });
            CanvasManagerService.canvas.on('mouse:wheel', () => {
                //console.log('mouse:wheel triggered');
                this.setBeingModified(true);
            });
            CanvasManagerService.canvas.on('object:rotating', () => {
                //console.log('object:rotating triggered');
                this.setBeingModified(true);
                this.updatePosition();
            });
            CanvasManagerService.canvas.on('object:modified', () => {
                //console.log('object:modified triggered');
                this.setBeingModified(false);
                this.updatePosition();
            });
            CanvasManagerService.canvas.on('selection:updated', () => {
                this.selectionTriggered();
            });
            CanvasManagerService.canvas.on('selection:created', () => {
                this.selectionTriggered();
            });
            CanvasManagerService.canvas.on('selection:cleared', () => {
                //console.log('selection:cleared');
                this.hideHeaderBar();
            });
            CanvasManagerService.canvas.on('after:render', () => {
                const selectedObject = this.canvasManagerService.getActiveObject();
                if (selectedObject) {
                    this.updatePosition();
                }
            });
        }
    }

    triggerAction() {
        // Call this method when the action you want to trigger happens
        this.sharedService.elementHeaderBarClosed.emit();
    }

    selectionTriggered() {
        //const selectedObject = this.canvasManagerService.getActiveObject();
        this.determineControls();
        this.setBeingModified(false);
        this.updatePosition();
        this.signalHeaderBarChange();
    }

    signalHeaderBarChange() {
        this.headerBarChange.emit();
    }

    getAbsoluteCoords(object: fabric.Point): fabric.Point {
        return CanvasManagerService.canvas && CanvasManagerService.canvas.viewportTransform
            ? fabric.util.transformPoint(
                  object,
                  fabric.util.invertTransform(CanvasManagerService.canvas.viewportTransform)
              )
            : object;
    }

    setBeingModified(value: boolean) {
        this.isBeingModified = value;
    }

    // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
    ngAfterViewInit() {
        this.determineControls();
        this.updatePosition();
        this.changeDetectorRef.detectChanges();
    }

    hideHeaderBar() {
        this.visibility = 'hidden';
        this.triggerAction();
    }

    ngOnChanges() {
        this.determineControls();
        this.updatePosition();
    }

    updatePosition() {
        const padding = 60; // Space between the element and the header bar, adjust as needed

        if (this.isBeingModified) {
            this.hideHeaderBar();
            return;
        }

        const selectedObject = this.canvasManagerService.getActiveObject();
        if (selectedObject) {
            const boundingRect = selectedObject.getBoundingRect(true, true);
            const zoom = CanvasManagerService.canvas?.getZoom() || 1;
            const viewportTransform = CanvasManagerService.canvas?.viewportTransform || [1, 0, 0, 1, 0, 0];

            // Calculate position based on the top-left corner of the bounding rectangle
            const x = boundingRect.left * zoom + viewportTransform[4];
            const y = boundingRect.top * zoom + viewportTransform[5];

            // Calculate the center position for the header bar relative to the selected element
            const headerWidth = this.headerBar.nativeElement.offsetWidth;
            const headerHeight = this.headerBar.nativeElement.offsetHeight;

            const headerBarCenterX = x - (headerWidth / 2);
            const headerBarTopY = y - headerHeight - padding; // Position above the element with space

            // Check if x, y coordinates overflow the viewport
            if (headerBarCenterX < padding) {
                this.left = padding;
            } else if (headerBarCenterX + headerWidth + padding > window.innerWidth) {
                this.left = window.innerWidth - headerWidth - padding;
            } else {
                this.left = headerBarCenterX;
            }

            this.top = headerBarTopY > padding ? headerBarTopY : padding;
            this.visibility = 'visible';
        } else {
            this.hideHeaderBar();
        }
    }


    getSelectedObjectPosition(): { top: number; left: number } | null {
        const selectedObject = this.canvasManagerService.getActiveObject();

        if (!selectedObject || !CanvasManagerService.canvas || !this.headerBar) {
            return null;
        }

        const boundingRect = selectedObject.getBoundingRect(true, true);
        const headerWidth = this.headerBar.nativeElement.offsetWidth / CanvasManagerService.canvas.getZoom();
        const headerHeight = this.headerBar.nativeElement.offsetHeight / CanvasManagerService.canvas.getZoom();

        const centerX = boundingRect.left + boundingRect.width / 2;
        const centerY = boundingRect.top;

        let left = centerX - headerWidth / 2;

        // Calculate top for header above and header below
        let topAbove = centerY - (headerHeight + this.headerSpacing / CanvasManagerService.canvas.getZoom());
        let topBelow =
            centerY +
            boundingRect.height / CanvasManagerService.canvas.getZoom() +
            this.headerSpacing / CanvasManagerService.canvas.getZoom();

        // Get the viewport transform
        const viewportTransform = CanvasManagerService.canvas.viewportTransform;

        // Calculate absolute top position for header above
        let absoluteTopAbove =
            topAbove * CanvasManagerService.canvas.getZoom() + (viewportTransform ? viewportTransform[5] : 0);

        // If header above is outside the viewport, use topBelow, else use topAbove
        let top = absoluteTopAbove < 0 ? topBelow : topAbove;

        return { top, left };
    }

    determineControls() {
        const selectedObject = this.canvasManagerService.getActiveObject();
        if (selectedObject) {
            //console.log('this.selectedObject.type', this.selectedObject.type);
            switch (selectedObject.type) {
                case 'text':
                    this.showFontControls = true;
                    this.showColorControls = true;
                    this.showSizeControls = true;
                    break;
                case 'i-text':
                    this.showFontControls = true;
                    this.showColorControls = true;
                    this.showSizeControls = true;
                    break;
                default:
                    this.showFontControls = false;
                    this.showColorControls = false;
                    this.showSizeControls = false;
                    break;
            }
        } else {
            this.showFontControls = false;
            this.showColorControls = false;
            this.showSizeControls = false;
        }
    }
}
