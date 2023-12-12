import { fabric } from 'fabric';
import { CustomFabricIText } from '../wrappers/derived/custom-fabric-itext.part';

export function handleTextClick(canvas: fabric.Canvas, event: any): void {
    if (canvas) {
        let pointer = canvas.getPointer(event.e);

        const textInput = new CustomFabricIText('', {
            left: pointer.x,
            top: pointer.y - 10,
            fill: '#000000',
            fontSize: 24,
            fontFamily: 'Source Sans Pro',
            editable: true,
            lockScalingFlip: true,
            selectionStart: 0,
            selectionEnd: 0
        });

        if (!canvas.getObjects().length) {
            canvas.renderOnAddRemove = false;
        }

        canvas.add(textInput);
        canvas.setActiveObject(textInput);

        textInput.enterEditing();

        textInput.on('editing:exited', () => {
            let textValue = textInput.text || '';
            if (validateText(textValue, 3, 100)) {
                textInput.bringToFront();
                const textOutput = new CustomFabricIText(textValue, {
                    left: textInput.left,
                    top: textInput.top,
                    fill: textInput.fill,
                    fontSize: textInput.fontSize,
                    fontFamily: textInput.fontFamily,
                    lockScalingFlip: textInput.lockScalingFlip
                });

                if (canvas) {
                    canvas.remove(textInput);
                    canvas.add(textOutput);
                    canvas.setActiveObject(textOutput);

                    if (!canvas.getObjects().length) {
                        canvas.renderOnAddRemove = true;
                        canvas.requestRenderAll();
                    }
                }
            } else {
                if (canvas) {
                    canvas.remove(textInput);
                }
            }
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey && textInput.isEditing) {
                textInput.exitEditing();
            }
        });

        canvas.requestRenderAll();
    }
}

export function validateText(text: string, minLength: number, maxLength: number): boolean {
    let trimmedText = text.trim();

    // Check if the text is not empty and if it meets the minimum and maximum length
    if (trimmedText !== '' && trimmedText.length >= minLength && trimmedText.length <= maxLength) {
        return true;
    } else {
        return false;
    }
}
