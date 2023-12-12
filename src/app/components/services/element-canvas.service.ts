import { Injectable } from '@angular/core';
import { fabric } from 'fabric';
import { SelectionManagerService } from '~components/canvas/services/selection-manager.service';
import { ZIndexManagerService } from '~components/canvas/services/zindex-manager.service';

@Injectable({
    providedIn: 'root'
})
export class ElementCanvasService {
    /*
    The maximum and minimum z-index are calculated automatically.
    */

    constructor(
        // eslint-disable-next-line no-unused-vars
        private selectionManagerService: SelectionManagerService,
        // eslint-disable-next-line no-unused-vars
        private zIndexManagerService: ZIndexManagerService
    ) {}
    delete(canvas: fabric.Canvas) {
        const activeObject = canvas.getActiveObject();

        if (!activeObject) {
            return;
        }

        if (activeObject.type === 'activeSelection') {
            // Cast activeObject to fabric.ActiveSelection to access the forEachObject method
            (activeObject as fabric.ActiveSelection).forEachObject((obj: fabric.Object) => {
                canvas.remove(obj);
            });
        } else {
            // Delete single active object
            canvas.remove(activeObject);
        }

        canvas.discardActiveObject();
        canvas.requestRenderAll();
    }
    lock(canvas: fabric.Canvas) {
        const activeObjects = canvas.getActiveObjects();

        if (activeObjects.length === 0) return;

        const lockedItems = this.selectionManagerService.getLockedItems();

        // Determine if any of the active objects are currently locked
        const anyLocked = activeObjects.some((object: fabric.Object) => lockedItems.includes(object));

        // If any object in the selection is locked, unlock everything
        const isLocked = !anyLocked;

        // Update the lock status for each individual object
        activeObjects.forEach((object: fabric.Object) => toggleLock(object, isLocked));

        // Update the lock status for the 'activeSelection' object if the group is selected
        if (activeObjects.length > 1) {
            const activeSelection = canvas.getActiveObject() as fabric.ActiveSelection;
            toggleLock(activeSelection, isLocked);
        }

        if (isLocked) {
            this.selectionManagerService.addLockedItems(activeObjects);
        } else {
            this.selectionManagerService.removeLockedItems(activeObjects);
        }

        canvas.requestRenderAll();

        function toggleLock(object: fabric.Object, lockStatus: boolean) {
            object.lockMovementX = lockStatus;
            object.lockMovementY = lockStatus;
            object.lockRotation = lockStatus;
            object.lockScalingX = lockStatus;
            object.lockScalingY = lockStatus;
        }
    }

    // eslint-disable-next-line no-unused-vars
    duplicate(canvas: fabric.Canvas, workingArea: fabric.Object) {
        const activeObject = canvas.getActiveObject();
        const debugLine = true; // Set to true to show the debug line

        if (activeObject) {
            const offset = 5; // Adjust this value as needed

            // Handle potentially undefined properties with non-null assertions or fallback values
            const centerX = ((workingArea as any).width ?? 0) / 2;
            const centerY = ((workingArea as any).height ?? 0) / 2;

            if (activeObject.type === 'activeSelection') {
                // Cast activeObject to fabric.ActiveSelection to access the getObjects method
                const activeSelection = activeObject as fabric.ActiveSelection;
                const objects = activeSelection.getObjects() as fabric.Object[];
                const clones: fabric.Object[] = [];

                // Bounding box center of the original objects
                const boundingBox = activeSelection.getBoundingRect();
                const originalCenterX = (boundingBox.left ?? 0) + (boundingBox.width ?? 0) / 2;
                const originalCenterY = (boundingBox.top ?? 0) + (boundingBox.height ?? 0) / 2;

                objects.forEach((obj: fabric.Object) => {
                    const clone = fabric.util.object.clone(obj) as fabric.Object;
                    canvas.add(clone);
                    clones.push(clone);
                });

                // Calculate the new left and top based on the direction to the working area center
                const newLeft = (activeSelection.left ?? 0) + (centerX - originalCenterX) / 5 + offset;
                const newTop = (activeSelection.top ?? 0) + (centerY - originalCenterY) / 5;

                const newGroup = new fabric.ActiveSelection(clones, { canvas: canvas });
                newGroup.set({ left: newLeft, top: newTop });

                canvas.discardActiveObject();
                canvas.setActiveObject(newGroup);

                // Draw the debug line if enabled
                if (debugLine) {
                    const line = new fabric.Line([originalCenterX, originalCenterY, centerX, centerY], {
                        stroke: 'black',
                        selectable: false
                    });
                    canvas.add(line);
                }
            } else {
                // Handle a single object
                const originalCenterX =
                    (activeObject.left ?? 0) + ((activeObject.width ?? 0) * (activeObject.scaleX ?? 1)) / 2;
                const originalCenterY =
                    (activeObject.top ?? 0) + ((activeObject.height ?? 0) * (activeObject.scaleY ?? 1)) / 2;

                const newLeft = (activeObject.left ?? 0) + (centerX - originalCenterX) / 5 + offset;
                const newTop = (activeObject.top ?? 0) + (centerY - originalCenterY) / 5;

                activeObject.clone((clonedObj: fabric.Object) => {
                    const cloned = clonedObj.set({
                        left: newLeft,
                        top: newTop,
                        lockScalingFlip: activeObject.lockScalingFlip
                    }) as fabric.Object;

                    canvas.add(cloned);
                    canvas.discardActiveObject();
                    canvas.setActiveObject(cloned);
                });

                // Draw the debug line if enabled
                if (debugLine) {
                    const line = new fabric.Line([originalCenterX, originalCenterY, centerX, centerY], {
                        stroke: 'black',
                        selectable: false
                    });
                    canvas.add(line);
                }
            }

            canvas.requestRenderAll();
        }
    }

    sendToBack(canvas: fabric.Canvas) {
        const activeObjects = canvas.getActiveObjects();
        if (activeObjects.length > 0) {
            const minIndex = this.zIndexManagerService.getMinIndexAll(canvas);
            const newIndex = Math.max(minIndex - 1, 0);
            activeObjects.forEach((object: fabric.Object) => {
                canvas.moveTo(object, newIndex);
            });
            canvas.requestRenderAll();
        }
    }

    bringToFront(canvas: fabric.Canvas) {
        const activeObjects = canvas.getActiveObjects();
        if (activeObjects.length > 0) {
            const maxIndex = this.zIndexManagerService.getMaxIndexAll(canvas);
            const newIndex = Math.min(maxIndex + 1, canvas.getObjects().length - 1);
            activeObjects.forEach((object: fabric.Object) => {
                canvas.moveTo(object, newIndex);
            });
            canvas.requestRenderAll();
        }
    }

    sendBackward(canvas: fabric.Canvas) {
        const activeObjects = canvas.getActiveObjects();
        if (activeObjects.length > 0) {
            const minIndex = this.zIndexManagerService.getMinIndexActiveObjects(activeObjects, canvas);
            const newIndex = Math.max(minIndex - 1, 0);

            // Now move all the active objects to the new index
            activeObjects.forEach((object: fabric.Object) => {
                canvas.moveTo(object, newIndex);
            });
            canvas.requestRenderAll();
        }
    }

    bringForward(canvas: fabric.Canvas) {
        const activeObjects = canvas.getActiveObjects();
        if (activeObjects.length > 0) {
            const maxIndex = this.zIndexManagerService.getMaxIndexActiveObjects(activeObjects, canvas);
            const newIndex = maxIndex + 1;

            // Now move all the active objects to the new index
            activeObjects.forEach((object: fabric.Object) => {
                canvas.moveTo(object, newIndex);
            });
            canvas.requestRenderAll();
        }
    }
}
