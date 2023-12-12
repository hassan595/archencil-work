import { Injectable } from '@angular/core';
import { fabric } from 'fabric';

@Injectable({
    providedIn: 'root'
})
export class ZIndexManagerService {
    getMinIndexActiveObjects(activeObjects: fabric.Object[], canvas: fabric.Canvas): number {
        let minIndex = canvas.getObjects().indexOf(activeObjects[0]);
        activeObjects.forEach((object) => {
            const index = canvas.getObjects().indexOf(object);
            if (index < minIndex) minIndex = index;
        });
        return minIndex;
    }

    getMaxIndexActiveObjects(activeObjects: fabric.Object[], canvas: fabric.Canvas): number {
        let maxIndex = canvas.getObjects().indexOf(activeObjects[0]);
        activeObjects.forEach((object) => {
            const index = canvas.getObjects().indexOf(object);
            if (index > maxIndex) maxIndex = index;
        });
        return maxIndex;
    }

    getMinIndexAll(canvas: fabric.Canvas): number {
        let minIndex = canvas.getObjects().length; // start with a value higher than any possible index
        canvas.getObjects().forEach((object, index) => {
            if (index < minIndex) minIndex = index;
        });
        return minIndex;
    }

    getMaxIndexAll(canvas: fabric.Canvas): number {
        let maxIndex = -1;
        canvas.getObjects().forEach((object, index) => {
            if (index > maxIndex) maxIndex = index;
        });
        return maxIndex;
    }
}
