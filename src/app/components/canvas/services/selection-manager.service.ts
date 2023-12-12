import { Injectable } from '@angular/core';
import { fabric } from 'fabric';

@Injectable({
    providedIn: 'root'
})
export class SelectionManagerService {
    public canvas!: fabric.Canvas;
    private selectedItems: fabric.Object[] = [];
    private lockedItems: fabric.Object[] = [];

    // eslint-disable-next-line no-unused-vars
    public handleSelectionCreated(event: fabric.IEvent): void {
        this.selectedItems = this.canvas.getActiveObjects();
        this.checkForLock();

        this.selectedItems.forEach((item) => {
            if (item.type === 'i-text') {
                let iTextItem = item as fabric.IText;
                iTextItem.editable = false;
                let clicks = 0;
                iTextItem.on('mousedown', function (e) {
                    clicks++;
                    setTimeout(() => {
                        if (clicks === 1) {
                            //console.log('Single click on i-text object');
                        } else {
                            //console.log('Double click on i-text object');
                            iTextItem.editable = true;
                            iTextItem.enterEditing();
                        }
                        // reset clicks
                        clicks = 0;
                    }, 300); // a delay of 300ms
                });
            }
        });
    }

    public handleSelectionUpdated(event: fabric.IEvent): void {
        // Since the selection:updated event does not clear previous selection,
        // we need to clear and re-add items in updated selection.
        this.selectedItems = [];
        this.handleSelectionCreated(event);
    }

    private checkForLock(): void {
        if (this.selectedItems.length > 1 && this.selectedItems.some((object) => this.lockedItems.includes(object))) {
            const activeSelection = this.canvas.getActiveObject() as fabric.ActiveSelection;
            if (activeSelection && activeSelection.type === 'activeSelection') {
                activeSelection.set({
                    lockMovementX: true,
                    lockMovementY: true,
                    lockRotation: true,
                    lockScalingX: true,
                    lockScalingY: true
                });
                this.canvas.renderAll(); // Ensure the changes are re-rendered on the canvas
            }
        }
    }

    // eslint-disable-next-line no-unused-vars
    public handleSelectionCleared(event: fabric.IEvent): void {
        // Clear the array when the selection is cleared
        this.selectedItems = [];
    }

    public getSelectedItems(): fabric.Object[] {
        return this.selectedItems;
    }

    public addLockedItems(items: fabric.Object[]): void {
        this.lockedItems.push(...items);
    }

    public removeLockedItems(items: fabric.Object[]): void {
        this.lockedItems = this.lockedItems.filter((item) => !items.includes(item));
    }

    public getLockedItems(): fabric.Object[] {
        return this.lockedItems;
    }
}
