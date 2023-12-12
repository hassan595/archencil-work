import { fabric } from 'fabric';
import { CustomFabricRect } from '../wrappers/derived/custom-fabric-rect.part';
import { CustomFabricIText } from '../wrappers/derived/custom-fabric-itext.part';

export function handleStickyNote(
    canvas: fabric.Canvas,
    event: any,
    setCursorStyle: (
        cursorImage: string | null,
        options?: { width?: number; height?: number; offsetX?: number; offsetY?: number }
    ) => void,
    getCurrentCursorStyle: () => string
): void {
    if (canvas) {
        let pointer = canvas.getPointer(event.e);
        let fabricPointer = new fabric.Point(pointer.x, pointer.y);

        // Check if there is any object at the clicked position
        const objects = canvas.getObjects();
        for (let i = 0; i < objects.length; i++) {
            const object = objects[i];

            // Skip the working area object
            if (object.name === 'workingArea') {
                continue;
            }

            if (object.containsPoint(fabricPointer)) {
                //console.log('Object Name:', object.name); // Output the name of the object for debugging purposes
                return; // Return if an object other than the ignored object already exists at the clicked position
            }
        }

        const stickyNoteBackground = new CustomFabricRect({
            left: pointer.x,
            top: pointer.y,
            fill: '#ffff88',
            width: 200,
            height: 200,
            rx: 10,
            ry: 10,
            hasControls: false,
            originX: 'left',
            originY: 'top',
            hoverCursor: 'text'
        });

        let stickyNoteText: fabric.IText | null = null;
        if (
            stickyNoteBackground.left !== undefined &&
            stickyNoteBackground.top !== undefined &&
            stickyNoteBackground.height !== undefined
        ) {
            stickyNoteText = new CustomFabricIText('', {
                left: stickyNoteBackground.left + 10,
                top: stickyNoteBackground.top + stickyNoteBackground.height / 2,
                fill: '#000000',
                fontSize: stickyNoteBackground.height / 2, // Initial large font size
                fontFamily: 'Arial',
                originX: 'left',
                originY: 'center',
                hasControls: false,
                lockUniScaling: true,
                lockMovementX: true,
                lockMovementY: true,
                //splitByGrapheme: false,
                hoverCursor: 'text'
            });
        }

        let currentCursorStyle: string | null;

        stickyNoteBackground.on('mouseover', () => {
            currentCursorStyle = getCurrentCursorStyle();
            //console.log('mouseon', currentCursorStyle);
        });
        stickyNoteBackground.on('mouseout', () => {
            // Return cursor back to original style
            setCursorStyle(currentCursorStyle);
            //console.log('mouseout', currentCursorStyle);
        });

        if (stickyNoteText) {
            stickyNoteText!.on('changed', function () {
                if (!stickyNoteText) {
                    // Handle the case where stickyNoteText is null or undefined
                    return;
                }
                if (canvas && stickyNoteBackground.width && stickyNoteBackground.height) {
                    const maxWidth = stickyNoteBackground.width - 20;
                    const maxHeight = stickyNoteBackground.height - 20;
                    let ctx = canvas.getContext();
                    let text = stickyNoteText?.text ?? '';
                    let newText = '';
                    let line = '';
                    let lineWidth = 0;
                    let linesCount = 1;
                    let fontSize = stickyNoteText?.fontSize ?? 12;
                    let textTotalHeight;
                    let widestLineWidth = 0; // To keep track of the widest line

                    if (text.length === 0) return;

                    // Preserve the original selection before processing
                    const originalSelectionStart = stickyNoteText!.selectionStart;
                    const originalSelectionEnd = stickyNoteText!.selectionEnd;

                    // Additional newlines added due to word wrap
                    let additionalNewLines = 0;

                    // decrease the font size until the total height of the text is within the sticky note's boundaries
                    do {
                        ctx.font = `${fontSize}px ${stickyNoteText!.fontFamily}`;
                        lineWidth = 0;
                        newText = '';
                        line = '';
                        linesCount = 1;

                        let originalSelectionStart =
                            stickyNoteText && stickyNoteText.selectionStart !== undefined
                                ? stickyNoteText.selectionStart
                                : 0;

                        for (let i = 0; i < text.length; i++) {
                            const char = text[i];
                            const charWidth = ctx.measureText(char).width;
                            lineWidth += charWidth;

                            if (lineWidth > maxWidth) {
                                if (i < originalSelectionStart) {
                                    additionalNewLines++;
                                }
                                newText += '\n' + line.trim();
                                if (lineWidth > widestLineWidth) {
                                    // Check if this line is the widest so far
                                    widestLineWidth = lineWidth;
                                }
                                line = '';
                                lineWidth = charWidth;
                                linesCount++;
                            } else if (lineWidth > widestLineWidth) {
                                widestLineWidth = lineWidth;
                            }

                            line += char;
                        }

                        fontSize--;
                        let lineHeight =
                            stickyNoteText && stickyNoteText.lineHeight !== undefined ? stickyNoteText.lineHeight : 1;
                        textTotalHeight = linesCount * (fontSize + lineHeight * fontSize); // account for line spacing
                    } while (textTotalHeight > maxHeight && fontSize > 0);

                    if (
                        originalSelectionStart === undefined ||
                        originalSelectionEnd === undefined ||
                        stickyNoteBackground.top === undefined
                    ) {
                        // Handle the case where originalSelectionStart, originalSelectionEnd, or stickyNoteBackground.top is undefined
                        return;
                    }

                    newText += '\n' + line.trim();
                    stickyNoteText!.text = newText.trim();
                    stickyNoteText!.selectionStart = originalSelectionStart + additionalNewLines;
                    stickyNoteText!.selectionEnd = originalSelectionEnd + additionalNewLines;

                    stickyNoteText!.set({ fontSize: fontSize + 1 }); // set the new font size
                    stickyNoteText!.width = widestLineWidth; // Set the width of the bounding box to the widest line's width

                    stickyNoteText!.top = stickyNoteBackground.top + stickyNoteBackground.height / 2; // always align text to center of stickyNoteBackground
                    stickyNoteText!.setCoords();

                    canvas.requestRenderAll();
                }
            });

            canvas.add(stickyNoteBackground, stickyNoteText);
            canvas.setActiveObject(stickyNoteText);

            stickyNoteText!.enterEditing();
        }

        canvas.renderAll();
    }
}
