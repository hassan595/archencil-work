import { Injectable } from '@angular/core';
import { fabric } from 'fabric';
import { CanvasManagerService } from './canvas-manager.service';
import { CustomFabricRect } from './wrappers/derived/custom-fabric-rect.part';

@Injectable({
    providedIn: 'root'
})
export class WorkingAreaService {
    public workingArea!: fabric.Rect;

    public workingAreaWidth = 10000;
    public workingAreaHeight = 10000;

    constructor() {}

    onScaling(canvas: fabric.Canvas, obj: any) {
        // Check if the object is being scaled outside the work area
        if (obj.width * obj.scaleX > this.workingAreaWidth || obj.height * obj.scaleY > this.workingAreaHeight) {
            // If outside bounds, revert to the previous scaling values
            obj.set({
                scaleX: obj.previousScaleX,
                scaleY: obj.previousScaleY
            });
        } else {
            // If within bounds, store the current scaling values
            obj.previousScaleX = obj.scaleX;
            obj.previousScaleY = obj.scaleY;
        }

        // Render the canvas
        canvas.renderAll();
    }

    // Add methods related to workingArea manipulation here
    public updateWorkingArea(canvas: fabric.Canvas) {
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        const viewportTransform = canvas.viewportTransform;
        const zoom = canvas.getZoom();

        canvas.forEachObject((obj) => {
            if (obj === this.workingArea) return; // Skip if the object is the working area or the green box

            let objBounds = obj.getBoundingRect();

            if (obj.group) {
                // If part of a group, get the bounding rectangle of the group
                objBounds = obj.group.getBoundingRect();
            }

            let transformedLeft, transformedTop;
            if (viewportTransform) {
                transformedLeft = (objBounds.left - viewportTransform[4]) / zoom;
                transformedTop = (objBounds.top - viewportTransform[5]) / zoom;
            } else {
                // Provide default values or handle the error appropriately
                transformedLeft = objBounds.left / zoom;
                transformedTop = objBounds.top / zoom;
            }

            const transformedWidth = objBounds.width / zoom;
            const transformedHeight = objBounds.height / zoom;

            if (transformedLeft + transformedWidth > this.workingAreaWidth) {
                transformedLeft = this.workingAreaWidth - transformedWidth;
                if (viewportTransform) {
                    obj.set({ left: transformedLeft * zoom + viewportTransform[4] });
                } else {
                    obj.set({ left: transformedLeft * zoom });
                }
            }
            if (transformedTop + transformedHeight > this.workingAreaHeight) {
                transformedTop = this.workingAreaHeight - transformedHeight;
                if (viewportTransform) {
                    obj.set({ top: transformedTop * zoom + viewportTransform[5] });
                } else {
                    obj.set({ top: transformedTop * zoom });
                }
            }

            obj.setCoords();

            minX = Math.min(minX, transformedLeft);
            minY = Math.min(minY, transformedTop);
            maxX = Math.max(maxX, transformedLeft + transformedWidth);
            maxY = Math.max(maxY, transformedTop + transformedHeight);
        });

        this.workingArea.set({
            left: minX,
            top: minY,
            width: Math.min(maxX - minX, this.workingAreaWidth),
            height: Math.min(maxY - minY, this.workingAreaHeight)
        });

        this.workingArea.setCoords();

        canvas.renderAll();
    }

    addWorkingArea(canvas: fabric.Canvas) {
        const rect = new CustomFabricRect({
            left: 0,
            top: 0,
            width: this.workingAreaWidth,
            height: this.workingAreaHeight,
            fill: 'rgba(255, 0, 0, 0.3)',
            selectable: false,
            evented: false,
            name: 'workingArea'
        });

        this.workingArea = rect; // Add this line
        canvas.add(rect);
        canvas.moveTo(rect, -1); // Move the rectangle to the bottom layer
    }

    public addEntityToCanvasImage(entity: fabric.Image, width: number, height: number): void {
        if (!this.workingArea) {
            console.error('No working area defined.');
            return;
        }

        // Get current viewport transformation values
        const zoom = CanvasManagerService.canvas!.getZoom();
        const viewportTransform = CanvasManagerService.canvas!.viewportTransform;

        // Calculate viewport's center position in relation to canvas's current zoom level and position
        let viewportCenterX, viewportCenterY;
        if (viewportTransform) {
            viewportCenterX = (-viewportTransform[4] + window.innerWidth / 2) / zoom;
            viewportCenterY = (-viewportTransform[5] + window.innerHeight / 2) / zoom;
        } else {
            console.error('viewportTransform is undefined');
            return;
        }

        // Get workingArea position
        const workingAreaLeft = this.workingArea.left;
        const workingAreaTop = this.workingArea.top;

        // Set workingArea factor here. This can be changed to control the entity size relative to the viewport.
        const viewportFactor = 0.3; // 30% of the viewport size

        // Calculate viewport dimensions
        const viewportWidth = window.innerWidth / zoom;
        const viewportHeight = window.innerHeight / zoom;

        // Calculate resized dimensions
        let resizeWidth, resizeHeight;
        if (viewportWidth > viewportHeight) {
            resizeWidth = viewportWidth * viewportFactor;
            resizeHeight = height * (resizeWidth / width);
        } else {
            resizeHeight = viewportHeight * viewportFactor;
            resizeWidth = width * (resizeHeight / height);
        }

        // Ensure the entity's size does not exceed the workingArea size
        if (resizeWidth > this.workingAreaWidth) {
            resizeWidth = this.workingAreaWidth;
            resizeHeight = height * (resizeWidth / width);
        }
        if (resizeHeight > this.workingAreaHeight) {
            resizeHeight = this.workingAreaHeight;
            resizeWidth = width * (resizeHeight / height);
        }

        entity.set({
            scaleX: resizeWidth / width,
            scaleY: resizeHeight / height,
            originX: 'center',
            originY: 'center'
        });

        // Check if viewport center is within the workingArea boundaries
        if (workingAreaLeft !== undefined && workingAreaTop !== undefined) {
            if (viewportCenterX - resizeWidth / 2 < workingAreaLeft) {
                viewportCenterX = workingAreaLeft + resizeWidth / 2;
            } else if (viewportCenterX + resizeWidth / 2 > workingAreaLeft + this.workingAreaWidth) {
                viewportCenterX = workingAreaLeft + this.workingAreaWidth - resizeWidth / 2;
            }

            if (viewportCenterY - resizeHeight / 2 < workingAreaTop) {
                viewportCenterY = workingAreaTop + resizeHeight / 2;
            } else if (viewportCenterY + resizeHeight / 2 > workingAreaTop + this.workingAreaHeight) {
                viewportCenterY = workingAreaTop + this.workingAreaHeight - resizeHeight / 2;
            }
        } else {
            // Provide default values or handle the error appropriately
            console.error('workingAreaLeft and/or workingAreaTop are undefined');
        }

        // Set position relative to workingArea
        entity.set({
            left: viewportCenterX,
            top: viewportCenterY
        });

        // Add to canvas
        CanvasManagerService.canvas!.add(entity);

        this.updateWorkingArea(CanvasManagerService.canvas!);
    }

    public addEntityToCanvasText(entity: fabric.Text): void {
        if (!this.workingArea) {
            console.error('No working area defined.');
            return;
        }

        // Add to canvas
        CanvasManagerService.canvas!.add(entity);

        this.updateWorkingArea(CanvasManagerService.canvas!);
    }

    public addEntityToCanvasIText(entity: fabric.IText): void {
        if (!this.workingArea) {
            console.error('No working area defined.');
            return;
        }

        // Add to canvas
        CanvasManagerService.canvas!.add(entity);

        this.updateWorkingArea(CanvasManagerService.canvas!);
    }
}
