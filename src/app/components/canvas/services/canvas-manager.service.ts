import { Injectable } from '@angular/core';
import { fabric } from 'fabric';
import { MouseCursorService } from '~components/services/other/mouse-cursor.service';
import { WorkingAreaService } from './working-area.service';
import { handleTextClick } from './canvas-manager-handles/text-handler.part';
import { handleStickyNote } from './canvas-manager-handles/sticky-note-handler.part';
import { CustomFabricObject } from '~src/app/components/canvas/services/wrappers/derived/custom-fabric-object.part';
import { CustomFabricText } from '~src/app/components/canvas/services/wrappers/derived/custom-fabric-text.part';
import { CustomFabricImage } from '~src/app/components/canvas/services/wrappers/derived/custom-fabric-image.part';
import { CustomFabricIText } from '~src/app/components/canvas/services/wrappers/derived/custom-fabric-itext.part';

@Injectable({
    providedIn: 'root'
})
export class CanvasManagerService {
    public static canvas: fabric.Canvas | null = null;

    constructor(
        // eslint-disable-next-line no-unused-vars
        private mouseCursorService: MouseCursorService,
        // eslint-disable-next-line no-unused-vars
        private workingAreaService: WorkingAreaService
    ) {}

    /* START - MOUSE CURSOR */

    setCursorStyle(
        cursorImage: string | null,
        options: { width?: number; height?: number; offsetX?: number; offsetY?: number } = {}
    ) {
        this.mouseCursorService.setCursorStyle(cursorImage, options);
    }

    getCurrentCursorStyle(): string {
        return this.mouseCursorService.getCurrentCursorStyle() || 'default';
    }

    resetCursorStyle() {
        this.mouseCursorService.resetCursorStyle();
    }

    /* END - MOUSE CURSOR */

    discardAllSelection() {
        if (CanvasManagerService.canvas) {
            CanvasManagerService.canvas.discardActiveObject();
        }

        // Now remove the headerbar
    }

    getActiveObject(): CustomFabricObject | CustomFabricIText | null {
        if (CanvasManagerService.canvas) {
            const activeObject = CanvasManagerService.canvas.getActiveObject();

            // Check if the active object is already one of the custom types
            if (activeObject instanceof CustomFabricObject) {
                return activeObject as CustomFabricObject;
            } else if (activeObject instanceof CustomFabricIText) {
                return activeObject as CustomFabricIText;
            }

            // If it's not one of the custom types, return null or handle accordingly
            // You may need to decide how to handle this case based on your application's needs
            return null;
        }

        return null;
    }

    prepareEntityForCanvas(entity: CustomFabricText | CustomFabricIText | CustomFabricImage): void {
        entity.manual = true;
        entity.id = `${Math.random().toString(36).substring(2)}`;
        entity.selected = false; // The object starts not selected
    }

    addEntityToCanvas(
        entity: CustomFabricText | CustomFabricIText | CustomFabricImage,
        width?: number,
        height?: number
    ): void {
        this.prepareEntityForCanvas(entity);

        if (entity instanceof CustomFabricIText) {
            this.workingAreaService.addEntityToCanvasIText(entity);
        } else if (entity instanceof CustomFabricText) {
            this.workingAreaService.addEntityToCanvasText(entity);
        } else if (entity instanceof CustomFabricImage) {
            if (width !== undefined && height !== undefined) {
                this.workingAreaService.addEntityToCanvasImage(entity, width, height);
            } else {
                console.error('Width and height must be provided for images.');
            }
        } else {
            // Handle error or other scenarios
        }
    }

    getCanvasElement(): fabric.Canvas | null {
        return CanvasManagerService.canvas;
    }

    handleTextClick(event: any): void {
        handleTextClick(CanvasManagerService.canvas!, event);
    }

    handleStickyNote(event: any): void {
        handleStickyNote(
            CanvasManagerService.canvas!,
            event,
            this.setCursorStyle.bind(this),
            this.getCurrentCursorStyle.bind(this)
        );
    }

    /**
     * Removes an element from the canvas based on its ID.
     * @param {string} id The ID of the element to remove.
     */
    removeElementById(id: string): void {
        console.log('Removing element by id', id);
        if (CanvasManagerService.canvas) {
            const objects = CanvasManagerService.canvas.getObjects();

            for (let i = 0; i < objects.length; i++) {
                const object = objects[i] as CustomFabricObject | CustomFabricIText; // Assuming all objects are one of these types
                console.log(object.id, ' == ', id);
                if (object.id === id) {
                    CanvasManagerService.canvas.remove(object);
                    console.log('Object found', object.id);
                    break; // Exit the loop once the object is found and removed
                }
            }

            console.log('No object found to id', id);

            CanvasManagerService.canvas.renderAll(); // Re-render the canvas to reflect the changes
        } else {
            console.log('No canvas.');
        }
    }
}
