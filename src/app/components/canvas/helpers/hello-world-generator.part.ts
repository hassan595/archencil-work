import { EntityHandlerService } from '../services/entity-handler.service';
import { getRandomPhrase, getRandomColor } from './helpers.part'

export function generateRandomHelloWorldTexts(canvas: fabric.Canvas, entityHandlerService : EntityHandlerService) {
    if (canvas.width && canvas.height) {
        for (let i = 0; i < 10; i++) {
            const randomLeft = Math.random() * (canvas.width - 100); // Subtracting 100 to avoid text going off the canvas
            const randomTop = Math.random() * (canvas.height - 50); // Subtracting 50 to avoid text going off the canvas
            const randomColor = getRandomColor(); // Generate a random color
            const randomPhrase = getRandomPhrase(5, 25); // Generate a random phrase with length between 5 and 25 characters
            entityHandlerService.addEntityIText(randomPhrase, randomLeft, randomTop, randomColor);
        }
    }
}



export function putTextForDebug(canvas: fabric.Canvas, entityHandlerService : EntityHandlerService, phrase: string, color: string = 'black') {
    if (canvas.width && canvas.height) {
        const randomLeft = Math.random() * (canvas.width - 100); // Subtracting 100 to avoid text going off the canvas
        const randomTop = Math.random() * (canvas.height - 50); // Subtracting 50 to avoid text going off the canvas

        entityHandlerService.addEntityIText(phrase, randomLeft, randomTop, color);
    }
}
