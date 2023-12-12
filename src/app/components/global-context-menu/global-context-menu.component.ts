import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { fabric } from 'fabric';

export interface ContextMenuItem {
    label: string;
    action: string;
    icon?: string;
}

@Component({
    selector: 'app-global-context-menu',
    templateUrl: './global-context-menu.component.html',
    styleUrls: ['./global-context-menu.component.scss']
})
export class GlobalContextMenuComponent implements OnInit {
    @Input() menuItems: ContextMenuItem[] = [];
    @Input() canvas!: fabric.Canvas;
    @Output() itemClicked: EventEmitter<string> = new EventEmitter();

    @ViewChild('submenu', { static: false, read: ElementRef }) submenu!: ElementRef;

    lockedStates: Map<string, boolean> = new Map();

    private mouse_x: number = 0;
    private mouse_y: number = 0;

    // eslint-disable-next-line no-unused-vars
    constructor(private elementRef: ElementRef) {}

    // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
    ngOnInit(): void {
        document.addEventListener('mousemove', (event) => {
            this.mouse_x = event.clientX;
            this.mouse_y = event.clientY;
        });
    }

    // eslint-disable-next-line no-unused-vars
    showContextMenu() {
        const activeObject = this.canvas.getActiveObject();
        // Check if activeObject is not null and has id and lockMovementX properties before accessing them
        if (activeObject && 'id' in activeObject && 'lockMovementX' in activeObject) {
            // Add this line to update the lockedStates map with the active object's lock state
            this.lockedStates.set(activeObject.id as string, activeObject.lockMovementX || false);
        }

        const contextMenu = this.elementRef.nativeElement.querySelector('#contextMenu');
        if (contextMenu) {
            const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
            const viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
            const contextMenuWidth = contextMenu.offsetWidth;
            const contextMenuHeight = contextMenu.offsetHeight;

            let adjustedX = this.mouse_x;
            let adjustedY = this.mouse_y;

            if (this.mouse_x + contextMenuWidth > viewportWidth) {
                adjustedX = viewportWidth - contextMenuWidth;
            }
            if (this.mouse_y + contextMenuHeight > viewportHeight) {
                adjustedY = viewportHeight - contextMenuHeight;
            }

            contextMenu.style.display = 'block';
            contextMenu.style.left = `${adjustedX}px`;
            contextMenu.style.top = `${adjustedY}px`;
        }
    }

    hideContextMenu() {
        const contextMenu = this.elementRef.nativeElement.querySelector('#contextMenu');
        if (contextMenu) {
            contextMenu.style.display = 'none';
        }
    }

    checkLockedState() {
        const activeObject = this.canvas.getActiveObject();
        // Check if activeObject is not null before accessing its id
        if (activeObject && 'id' in activeObject) {
            return this.lockedStates.get(activeObject.id as string) || false;
        }
        return false;
    }

    updateMenuLabels() {
        const lockItem = this.menuItems.find((item) => item.action === 'lock');
        const isLocked = this.checkLockedState();

        if (lockItem) {
            lockItem.label = isLocked ? 'Unlock' : 'Lock';
        }
    }

    // eslint-disable-next-line no-unused-vars
    onItemClick(action: string, objectId: string) {
        if (this.canvas) {
            const activeObject = this.canvas.getActiveObject();
            // Check if activeObject is not null and has id property before accessing it
            if (activeObject && 'id' in activeObject) {
                const activeObjectId = activeObject.id as string;
                if (action === 'lock') {
                    const currentLockedState = this.lockedStates.get(activeObjectId) || false;
                    this.lockedStates.set(activeObjectId, !currentLockedState);

                    // Add this line to update labels after the locked state is changed
                    this.updateMenuLabels();
                }
            }
        }
        this.itemClicked.emit(action);
    }
}
