import { Injectable } from '@angular/core';
import { CanvasManagerService } from '~components/canvas/services/canvas-manager.service';
import { CustomFabricIText } from './wrappers/derived/custom-fabric-itext.part';

@Injectable({
    providedIn: 'root'
})
export class EntityHandlerService {
    constructor(
        // eslint-disable-next-line no-unused-vars
        private canvasManagerService: CanvasManagerService
    ) {}

    addEntityIText(str: string, left: number, top: number, color: string): void {
        const text = new CustomFabricIText(str, {
            left: left,
            top: top,
            fill: color, // Set the color of the text
            fontSize: 24,
            fontFamily: 'Source Sans Pro',
            lockScalingFlip: true, // Prevent flipping by scaling into negative values
            name: 'Text:' + str // Set the name property
        });
        text.bringToFront();

        this.canvasManagerService.addEntityToCanvas(text);
    }

}
