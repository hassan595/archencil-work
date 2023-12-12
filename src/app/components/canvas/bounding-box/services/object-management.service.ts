import { Injectable } from '@angular/core';
import { fabric } from 'fabric';

@Injectable({
    providedIn: 'root'
})
export class ObjectManagementService {
    // Put the delete() and handleObjectSelection() methods here

    delete(canvas: fabric.Canvas) {
        const activeObject = canvas.getActiveObject();

        if (!activeObject) {
            return;
        }

        if (activeObject.type === 'activeSelection' && activeObject instanceof fabric.ActiveSelection) {
            // Delete all objects in active selection
            activeObject.forEachObject((obj) => {
                canvas.remove(obj);
            });
        } else {
            // Delete single active object
            canvas.remove(activeObject);
        }

        canvas.discardActiveObject();
        canvas.requestRenderAll();
    }
}
