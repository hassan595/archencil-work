import { AfterViewInit, Component, OnDestroy, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { fabric } from 'fabric';
import { EntityHandlerService } from './services/entity-handler.service';
import { CanvasManagerService } from './services/canvas-manager.service';
import { ToolsMenuComponent } from './tools-menu/tools-menu.component';
import { WorkingAreaService } from './services/working-area.service';
import { SelectionManagerService } from './services/selection-manager.service';
import { generateRandomHelloWorldTexts, putTextForDebug } from './helpers/hello-world-generator.part';

@Component({
    selector: 'app-canvas',
    templateUrl: './canvas.component.html',
    styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild(ToolsMenuComponent, { static: false }) toolsMenu!: ToolsMenuComponent;

    public canvas!: fabric.Canvas;
    private isSpacePressed = false;
    private isPanning = false;
    private lastPosX!: number;
    private lastPosY!: number;

    public minZoom: number;
    public maxZoom: number;

    showRedDot: boolean = false;
    redDotPosition = { x: 0, y: 0 };

    constructor(
        private canvasManagerService: CanvasManagerService,
        private entityHandlerService: EntityHandlerService,
        private renderer: Renderer2,
        private el: ElementRef,
        private workingAreaService: WorkingAreaService,
        private selectionManagerService: SelectionManagerService
    ) {
        this.minZoom = 0.1; // Set the minimum zoom level
        this.maxZoom = 10; // Set the maximum zoom level
    }

    ngOnInit() {
        // Create the canvas
        this.canvas = new fabric.Canvas('canvas', {
            selection: true,
            fireRightClick: true, // <-- enable firing of right click events
            fireMiddleClick: true, // <-- enable firing of middle click events
            stopContextMenu: false, // <--  prevent context menu from showing
            //lockScalingFlip: true, //TODO Not working anymore. Check for any update.
            preserveObjectStacking: true
        });

        this.workingAreaService.addWorkingArea(this.canvas);

        this.selectionManagerService.canvas = this.canvas;

        // TODO really needed?
        // https://github.com/fabricjs/fabric.js/issues/6840
        fabric.ActiveSelection.prototype.toGroup = function () {
            let objects = this._objects.concat();
            // added this sort to maintain display order...
            objects.sort((a, b) => {
                if (this.canvas) {
                    return this.canvas._objects.indexOf(a) - this.canvas._objects.indexOf(b);
                } else {
                    return 0;
                }
            });
            this._objects = [];
            let options = fabric.Object.prototype.toObject.call(this);
            let newGroup = new fabric.Group([]);
            delete options.type;
            newGroup.set(options);
            objects.forEach((object) => {
                if (object.canvas) {
                    object.canvas.remove(object);
                }
                object.group = newGroup;
            });
            newGroup._objects = objects;
            if (!this.canvas) {
                return newGroup;
            }
            let canvas = this.canvas;
            canvas.add(newGroup);
            canvas._activeObject = newGroup;
            newGroup.setCoords();
            return newGroup;
        };

        // Pass the canvas to the service
        CanvasManagerService.canvas = this.canvas;

        this.canvas.selectionKey = 'ctrlKey';

        this.resizeCanvas();

        window.addEventListener('resize', this.resizeCanvas.bind(this));
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
        this.canvas.on('mouse:down', this.handleMouseDown.bind(this));
        this.canvas.on('mouse:move', this.handleMouseMove.bind(this));
        this.canvas.on('mouse:up', this.handleMouseUp.bind(this));
        this.canvas.on('mouse:move', this.handleMouseMove.bind(this));
        this.canvas.on('selection:created', this.handleSelectionCreated.bind(this));
        this.canvas.on('selection:updated', this.handleSelectionUpdated.bind(this));
        this.canvas.on('selection:cleared', this.handleSelectionCleared.bind(this));
        (this.canvas as any).wrapperEl.addEventListener('wheel', this.handleMouseWheel.bind(this));
        generateRandomHelloWorldTexts(this.canvas, this.entityHandlerService);
        putTextForDebug(this.canvas, this.entityHandlerService, 'Debugging text');

        //this.workingAreaService.addWorkingArea(this.canvas);

        setTimeout(() => {
            this.canvas.renderAll();
        }, 0);

        /*this.canvas.on('object:modified', () => {
            this.minimap.syncCanvasObjects();
        });*/

        // Add the scaling event listener
        this.canvas.on('object:scaling', (e) => {
            // eslint-disable-next-line no-unused-vars
            const obj = e.target;

            this.workingAreaService.onScaling(this.canvas, obj);

            // Render the canvas
            this.canvas.renderAll();
        });
    }

    handleSelectionCreated(event: fabric.IEvent) {
        this.selectionManagerService.handleSelectionCreated(event);
    }

    handleSelectionUpdated(event: fabric.IEvent) {
        this.selectionManagerService.handleSelectionUpdated(event);
    }

    handleSelectionCleared(event: fabric.IEvent) {
        this.selectionManagerService.handleSelectionCleared(event);
    }

    getWorkingArea(): fabric.Rect {
        return this.workingAreaService.workingArea || new fabric.Rect();
    }

    onMinimapClicked(event: any): void {
        // Your logic for handling the minimap click event
        console.log('Minimap clicked:', event);
    }

    ngAfterViewInit() {
        this.workingAreaService.updateWorkingArea(this.canvas);

        // Prevent the browser's default context menu
        (this.canvas as any).lowerCanvasEl.addEventListener('contextmenu', (e: Event) => {
            e.preventDefault();
        });
    }

    ngOnDestroy() {
        window.removeEventListener('resize', this.resizeCanvas.bind(this));
        window.removeEventListener('keydown', this.handleKeyDown.bind(this));
        window.removeEventListener('keyup', this.handleKeyUp.bind(this));
        (this.canvas as any).wrapperEl.removeEventListener('wheel', this.handleMouseWheel.bind(this));
    }

    handleKeyDown(event: KeyboardEvent) {
        if (this.workingAreaService?.workingArea && this.canvas?.viewportTransform) {
            if (event.ctrlKey && event.code === 'KeyK') {
                if (this.workingAreaService.workingArea.width && this.workingAreaService.workingArea.height) {
                    const scaleFactor = Math.min(
                        500 / this.workingAreaService.workingArea.width,
                        300 / this.workingAreaService.workingArea.height
                    );

                    // Save the current viewport transform of the main canvas
                    const prevViewportTransform = this.canvas.viewportTransform.slice();

                    // Reset the viewport transform of the main canvas to default values
                    this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

                    const dataUrl = this.canvas.toDataURL({
                        left: this.workingAreaService.workingArea.left,
                        top: this.workingAreaService.workingArea.top,
                        width: this.workingAreaService.workingArea.width,
                        height: this.workingAreaService.workingArea.height,
                        multiplier: scaleFactor
                    });

                    // Restore the previous viewport transform of the main canvas
                    this.canvas.setViewportTransform(prevViewportTransform);

                    // Open the screenshot in a new tab
                    window.open(dataUrl, '_blank');
                }
            }
        }

        if (event.code === 'Space' && this.canvas) {
            this.isSpacePressed = true;
            this.canvas.defaultCursor = 'grab';
        }

        if (event.altKey && event.code === 'KeyK' && this.canvas) {
            this.showRedDot = !this.showRedDot;
            if (this.showRedDot) {
                if (this.canvas.width && this.canvas.height) {
                    this.redDotPosition.x = this.canvas.width / 2 - 5;
                    this.redDotPosition.y = this.canvas.height / 2 - 5;
                }
            }
        }
    }

    handleKeyUp(event: KeyboardEvent) {
        if (event.code === 'Space') {
            this.isSpacePressed = false;
            this.canvas.defaultCursor = 'default';
        }
    }

    handleMouseDown(event: fabric.IEvent) {
        if (this.isSpacePressed) {
            this.isPanning = true;
            this.canvas.defaultCursor = 'grabbing';
            this.lastPosX = (event.e as MouseEvent).clientX;
            this.lastPosY = (event.e as MouseEvent).clientY;
        } else {
            if (ToolsMenuComponent.currentSelected == 'Select') {
                //console.log(ToolsMenuComponent.currentSelected);
            } else if (ToolsMenuComponent.currentSelected == 'Text') {
                this.canvasManagerService.handleTextClick(event);
            } else if (ToolsMenuComponent.currentSelected == 'Sticky note') {
                this.canvasManagerService.handleStickyNote(event);
            } else if (ToolsMenuComponent.currentSelected == 'Shape') {
                //console.log(ToolsMenuComponent.currentSelected);
            } else if (ToolsMenuComponent.currentSelected == 'Connection') {
                //console.log(ToolsMenuComponent.currentSelected);
            } else if (ToolsMenuComponent.currentSelected == 'Drawing') {
                //console.log(ToolsMenuComponent.currentSelected);
            } else if (ToolsMenuComponent.currentSelected == 'Comment') {
                //console.log(ToolsMenuComponent.currentSelected);
            } else if (ToolsMenuComponent.currentSelected == 'Frame') {
                //console.log(ToolsMenuComponent.currentSelected);
            }
        }
    }

    handleMouseMove(event: fabric.IEvent) {
        if (this.isPanning && event.e && this.canvas.viewportTransform) {
            const mouseEvent = event.e as MouseEvent;
            const deltaLeft = mouseEvent.clientX - this.lastPosX;
            const deltaTop = mouseEvent.clientY - this.lastPosY;

            const currentLeft = this.canvas.viewportTransform[4];
            const currentTop = this.canvas.viewportTransform[5];

            const newLeft = currentLeft + deltaLeft;
            const newTop = currentTop + deltaTop;

            // Define your panning boundaries
            const leftBoundary = -this.workingAreaService.workingAreaWidth;
            const rightBoundary = this.workingAreaService.workingAreaWidth;
            const topBoundary = -this.workingAreaService.workingAreaHeight;
            const bottomBoundary = this.workingAreaService.workingAreaHeight;

            // Check if the new viewport position is within the boundaries
            if (
                newLeft >= leftBoundary &&
                newLeft <= rightBoundary &&
                newTop >= topBoundary &&
                newTop <= bottomBoundary
            ) {
                this.canvas.relativePan(new fabric.Point(deltaLeft, deltaTop));
            }

            this.lastPosX = (event.e as MouseEvent).clientX;
            this.lastPosY = (event.e as MouseEvent).clientY;
        } else if (event.target && !this.isSpacePressed) {
            const target = event.target;
            target.setCoords(); // Update the object's coordinates

            const zoom = this.canvas.getZoom();
            let oCoords = target.oCoords;
            const viewportTransform = this.canvas.viewportTransform;

            const minX = 0;
            const maxX = this.workingAreaService.workingAreaWidth;
            const minY = 0;
            const maxY = this.workingAreaService.workingAreaHeight;

            // Calculate the necessary adjustments
            let deltaX = 0;
            let deltaY = 0;

            // Apply the adjustments
            if (target.left !== undefined && target.top !== undefined) {
                target.set({
                    left: target.left + deltaX,
                    top: target.top + deltaY
                });
            }
            target.setCoords();

            const coordsArray = ['tl', 'tr', 'bl', 'br'];
            if (oCoords && viewportTransform) {
                for (const coord of coordsArray) {
                    const key = coord as keyof typeof oCoords;
                    const transformedX = (oCoords[key].x - viewportTransform[4]) / zoom;
                    const transformedY = (oCoords[key].y - viewportTransform[5]) / zoom;

                    if (transformedX < minX) {
                        deltaX = Math.max(deltaX, minX - transformedX);
                    } else if (transformedX > maxX) {
                        deltaX = Math.min(deltaX, maxX - transformedX);
                    }

                    if (transformedY < minY) {
                        deltaY = Math.max(deltaY, minY - transformedY);
                    } else if (transformedY > maxY) {
                        deltaY = Math.min(deltaY, maxY - transformedY);
                    }
                }
            }

            // Apply the adjustments
            if (target.left !== undefined && target.top !== undefined) {
                target.set({
                    left: target.left + deltaX,
                    top: target.top + deltaY
                });
            }

            target.setCoords();

            // Double-check and make sure no corners are outside the boundary box
            if (target.oCoords && viewportTransform && target.left !== undefined && target.top !== undefined) {
                const oCoords = target.oCoords;
                for (const coord of coordsArray) {
                    const key = coord as keyof typeof oCoords;
                    const transformedX = (oCoords[key].x - viewportTransform[4]) / zoom;
                    const transformedY = (oCoords[key].y - viewportTransform[5]) / zoom;

                    if (transformedX < minX) {
                        target.set({ left: target.left + (minX - transformedX) });
                    } else if (transformedX > maxX) {
                        target.set({ left: target.left - (transformedX - maxX) });
                    }

                    if (transformedY < minY) {
                        target.set({ top: target.top + (minY - transformedY) });
                    } else if (transformedY > maxY) {
                        target.set({ top: target.top - (transformedY - maxY) });
                    }
                }
            }

            target.setCoords();

            this.workingAreaService.updateWorkingArea(this.canvas);
        }
    }

    handleMouseWheel(event: WheelEvent) {
        event.preventDefault();
        event.stopPropagation();

        const maxZoom = this.maxZoom;
        const minZoom = this.minZoom;

        let delta = Math.sign(event.deltaY);
        const smoothZoomFactor = 1.1; // Smoother zoom
        const fastZoomFactor = 1.3; // Faster zoom when Alt key is pressed

        const zoomFactor = event.altKey ? fastZoomFactor : smoothZoomFactor;

        let zoomLevel = this.canvas.getZoom();

        // Calculate the new zoom level logarithmically
        let targetZoomLevel = delta < 0 ? zoomLevel * zoomFactor : zoomLevel / zoomFactor;

        // Clamp the zoom level within the maximum and minimum scroll values
        targetZoomLevel = Math.max(minZoom, Math.min(maxZoom, targetZoomLevel));

        // Get the canvas-relative position of the mouse
        const boundingRect = (this.canvas as any).wrapperEl.getBoundingClientRect();
        const canvasMouseX = event.clientX - boundingRect.left;
        const canvasMouseY = event.clientY - boundingRect.top;

        // Directly set the zoom level without animation
        this.canvas.zoomToPoint(new fabric.Point(canvasMouseX, canvasMouseY), targetZoomLevel);
        this.canvas.renderAll(); // Re-render the canvas
    }

    handleMouseUp() {
        this.isPanning = false;
        if (this.isSpacePressed) {
            this.canvas.defaultCursor = 'grab';
        }
    }

    resizeCanvas() {
        const canvasContainer = document.querySelector('.canvas-container') as HTMLElement;
        this.canvas.setWidth(canvasContainer.clientWidth);
        this.canvas.setHeight(canvasContainer.clientHeight);
        this.canvas.calcOffset();
        this.canvas.renderAll();
    }

}
