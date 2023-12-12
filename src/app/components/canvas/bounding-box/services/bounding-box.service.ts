import { Injectable } from '@angular/core';
import { fabric } from 'fabric';

@Injectable({
    providedIn: 'root'
})
export class BoundingBoxService {
    // -- All fabric.js related methods --

    setCustomControls(rotationImgIcon: any) {
        fabric.Object.prototype.transparentCorners = false;
        fabric.Object.prototype.cornerColor = 'white';
        fabric.Object.prototype.cornerStyle = 'circle';

        const strokeColor = 'grey';
        const strokeWidth = 1; // adjust as needed
        const circleSize = 10; // adjust as needed

        // redefine render function for corner controls
        const controls = ['tl', 'tr', 'bl', 'br', 'ml', 'mt', 'mr', 'mb'];
        controls.forEach((control) => {
            // eslint-disable-next-line no-unused-vars
            fabric.Object.prototype.controls[control].render = function (ctx, left, top, styleOverride, fabricObject) {
                styleOverride = styleOverride || {};
                ctx.save();
                ctx.strokeStyle = styleOverride.cornerStrokeColor || strokeColor;
                ctx.lineWidth = styleOverride.cornerStrokeWidth || strokeWidth;
                ctx.fillStyle = styleOverride.cornerColor || fabricObject.cornerColor;
                ctx.beginPath();
                ctx.arc(left, top, circleSize / 2, 0, Math.PI * 2, false);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                ctx.restore();
            };
        });

        // Rotation control
        fabric.Object.prototype.controls['mtr'] = new fabric.Control({
            x: -0.5, // Shifted to the left
            y: 0.5, // Shifted to the bottom
            offsetX: -20, // Adjust offsetX if needed
            offsetY: 20, // Adjust offsetY if needed
            cursorStyle: 'grab',
            /*actionHandler: fabric.controlsUtils.rotationWithSnapping,*/
            actionName: 'rotate',
            /*cornerSize: 38,*/
            withConnection: false,
            render: (ctx, left, top, styleOverride, fabricObject) => {
                this.renderRotationControl(ctx, left, top, styleOverride, fabricObject, rotationImgIcon);
            }
        });

        // Rotation control visibility
        fabric.Object.prototype.setControlVisible('mtr', true);
    }

    // Defining how the rendering action will be
    renderRotationControl(ctx: any, left: any, top: any, styleOverride: any, fabricObject: any, rotationImgIcon: any) {
        const size = 24;
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));

        // Check if the fabricObject is locked, being dragged or rotated
        const isLocked =
            fabricObject.lockMovementX &&
            fabricObject.lockMovementY &&
            fabricObject.lockScalingX &&
            fabricObject.lockScalingY &&
            fabricObject.lockRotation;
        const isDraggingOrRotating = fabricObject.isMoving || fabricObject.isRotating;

        // Set the global alpha based on the locked state or the dragging/rotating state
        ctx.globalAlpha = isLocked || isDraggingOrRotating ? 0.3 : 1;

        ctx.drawImage(rotationImgIcon, -size / 2, -size / 2, size, size);
        ctx.restore();
    }

    modifyBoundingBox() {
        fabric.Object.prototype.set({
            strokeWidth: 3, // Add a 20px transparent stroke
            stroke: 'rgba(0, 0, 0, 0)' // Make the stroke transparent
        });
    }
}
