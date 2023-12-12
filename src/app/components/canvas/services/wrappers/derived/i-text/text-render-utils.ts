import { fabric } from 'fabric';

export function _renderStrikethrough(instance: fabric.IText, ctx: CanvasRenderingContext2D): void {
    if (instance.linethrough && instance.text) {
        const fontSize = instance.fontSize || 16;
        const metrics = ctx.measureText(instance.text);
        const strikethroughY = metrics.actualBoundingBoxAscent / 2 - metrics.actualBoundingBoxDescent;
        const lineWidth = fontSize / 20;

        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = instance.fill ? instance.fill.toString() : 'black';
        ctx.lineWidth = lineWidth;

        const textWidth = instance.width || calcTextWidth(instance);
        const lineStartX = -(textWidth / 2);
        const lineEndX = textWidth / 2;

        ctx.moveTo(lineStartX, strikethroughY);
        ctx.lineTo(lineEndX, strikethroughY);
        ctx.stroke();
        ctx.restore();
    }
}

export function _renderUnderline(instance: fabric.IText, ctx: CanvasRenderingContext2D): void {
    if (instance.underline && instance.text) {
        const textWidth = calcTextWidth(instance);
        const metrics = ctx.measureText(instance.text);
        const fontSize = instance.fontSize || 16;
        const baseline = metrics.actualBoundingBoxAscent || fontSize;
        const descent = metrics.actualBoundingBoxDescent || fontSize * 0.25;
        const scalingFactor = instance.scaleY || 1;
        const underlineTop = baseline - descent * scalingFactor;

        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = instance.fill ? (instance.fill as string) : 'black';
        ctx.lineWidth = (fontSize * 0.05) / scalingFactor;
        ctx.moveTo(-textWidth / 2, underlineTop);
        ctx.lineTo(textWidth / 2, underlineTop);
        ctx.stroke();
        ctx.restore();
    }
}

export function calcTextWidth(instance: fabric.IText): number {
    const ctx = instance.canvas?.getContext();
    if (ctx && instance.text) {
        ctx.font = _getFontDeclaration(instance);
        return ctx.measureText(instance.text).width;
    }
    return 0;
}

export function _getFontDeclaration(instance: fabric.IText): string {
    const fontStyle = instance.fontStyle || 'normal';
    const fontWeight = instance.fontWeight || 'normal';
    const fontSize = `${instance.fontSize || 16}px`;
    const fontFamily = instance.fontFamily || 'sans-serif';
    return `${fontStyle} ${fontWeight} ${fontSize} ${fontFamily}`;
}

export function _recalculateDimensions(instance: fabric.IText): void {
    const ctx = instance.canvas?.getContext();
    if (ctx && instance.text) {
        ctx.font = _getFontDeclaration(instance);
        const metrics = ctx.measureText(instance.text);
        const newWidth = metrics.width;
        const newHeight = _calculateBoundingBoxHeight(instance, metrics);

        if (instance.width !== newWidth || instance.height !== newHeight) {
            instance.width = newWidth;
            instance.height = newHeight;
            instance.scaleX = 1;
            instance.scaleY = 1;
            instance.setCoords();
            instance.canvas?.requestRenderAll();
        }
    }
}

export function _calculateBoundingBoxHeight(instance: fabric.IText, metrics: TextMetrics): number {
    const safeFontSize = instance.fontSize ?? 16;
    const ascent = metrics.actualBoundingBoxAscent ?? safeFontSize;
    const descent = metrics.actualBoundingBoxDescent ?? safeFontSize * 0.25;
    const additionalHeight = (instance.underline || instance.linethrough) ? safeFontSize * 0.2 : 0;

    return ascent + descent + additionalHeight;
}
