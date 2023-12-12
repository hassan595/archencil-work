import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { fabric } from 'fabric';
import { GlobalContextMenuComponent } from '~components/global-context-menu/global-context-menu.component';
import { ElementCanvasService } from '~components/services/element-canvas.service';

interface ContextMenuItem {
    label: string;
    action: string;
    icon: string;
}

@Component({
    selector: 'app-context-menu',
    templateUrl: './context-menu.component.html',
    styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements AfterViewInit, OnInit {
    @ViewChild(GlobalContextMenuComponent) globalContextMenu!: GlobalContextMenuComponent;
    @Input() canvas!: fabric.Canvas;
    @Input() workingArea!: fabric.Object;

    constructor(
        // eslint-disable-next-line no-unused-vars
        private elementCanvasService: ElementCanvasService
    ) {}

    lockButtonText = 'Lock';

    contextMenuItems: ContextMenuItem[] = [
        {
            label: 'Edit',
            action: 'edit',
            icon: './assets/icons/svg/element-actions/edit.svg'
        },
        {
            label: 'Bring up',
            action: 'bringUpOneLayer',
            icon: './assets/icons/svg/element-actions/up-arrow.svg'
        },
        {
            label: 'Send back',
            action: 'sendBackOneLayer',
            icon: './assets/icons/svg/element-actions/up-arrow-1.svg'
        },
        {
            label: 'Bring to top',
            action: 'bringToTop',
            icon: './assets/icons/svg/element-actions/downward-1.svg'
        },
        {
            label: 'Send to bottom',
            action: 'sendToBottom',
            icon: './assets/icons/svg/element-actions/downward.svg'
        },
        {
            label: 'Duplicate',
            action: 'duplicate',
            icon: './assets/icons/svg/element-actions/duplicate.svg'
        },
        {
            label: 'Reset Angle',
            action: 'resetAngle',
            icon: './assets/icons/svg/element-actions/angle.svg'
        },
        {
            label: 'Lock',
            action: 'lock',
            icon: './assets/icons/svg/element-actions/unlock.svg'
        },
        {
            label: 'Delete',
            action: 'delete',
            icon: './assets/icons/svg/element-actions/delete.svg'
        }
    ];

    // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
    ngOnInit(): void {}

    ngAfterViewInit() {
        this.canvas.on('mouse:down', (options) => {
            const target = this.canvas.findTarget(options.e, false);
            if (target) {
                this.canvas.setActiveObject(target);
            }

            if (options.e.button === 2) {
                const pointer = options.pointer;
                if (!pointer) return;

                const activeObject = this.canvas.getActiveObject();
                const activeGroup = this.canvas.getActiveObjects();

                let clickedOnActiveObject = false;

                if (activeObject && activeObject.containsPoint(pointer)) {
                    clickedOnActiveObject = true;
                } else if (activeGroup.length > 0) {
                    clickedOnActiveObject = activeGroup.some((object) => object.containsPoint(pointer));
                }

                if (clickedOnActiveObject) {
                    this.showContextMenu();

                    requestAnimationFrame(() => {
                        const canvasBounds = this.canvas.getElement().getBoundingClientRect();
                        const menu = document.getElementById('contextMenu');

                        if (!menu) return;

                        const menuWidth = menu.offsetWidth;
                        const menuHeight = menu.offsetHeight;

                        let x = pointer.x + canvasBounds.left;
                        let y = pointer.y + canvasBounds.top;

                        if (x + menuWidth > window.innerWidth) {
                            x -= menuWidth;
                        }

                        if (y + menuHeight > window.innerHeight) {
                            y -= menuHeight;
                        }

                        menu.style.left = `${x}px`;
                        menu.style.top = `${y}px`;
                    });
                } else {
                    this.hideContextMenu();
                }
            } else {
                this.hideContextMenu();
            }
        });
    }

    onContextMenuItemClicked(action: string) {
        switch (action) {
            case 'edit':
                this.edit();
                break;
            case 'sendToBottom':
                this.sendToBack();
                break;
            case 'sendBackOneLayer':
                this.sendBackward();
                break;
            case 'bringToTop':
                this.bringToFront();
                break;
            case 'bringUpOneLayer':
                this.bringForward();
                break;
            case 'duplicate':
                this.duplicate();
                break;
            case 'resetAngle':
                this.resetAngle();
                break;
            case 'lock':
                this.lock();
                break;
            case 'delete':
                this.delete();

                break;
            default:
                console.log('Unknown action:', action);
        }
    }

    delete() {
        this.elementCanvasService.delete(this.canvas);
        this.hideContextMenu();
    }

    showContextMenu() {
        const activeObject = this.canvas.getActiveObject();
        if (activeObject) {
            // Update lock status for context menu item
            const lockItem = this.contextMenuItems.find((item) => item.action === 'lock');
            if (lockItem) {
                // Check if the active object is locked or not
                const isLocked =
                    activeObject.lockMovementX &&
                    activeObject.lockMovementY &&
                    activeObject.lockRotation &&
                    activeObject.lockScalingX &&
                    activeObject.lockScalingY;

                lockItem.label = isLocked ? 'Unlock' : 'Lock';
                lockItem.icon = isLocked
                    ? './assets/icons/svg/element-actions/padlock.svg'
                    : './assets/icons/svg/element-actions/unlock.svg';
            }
            this.globalContextMenu.showContextMenu();
        }
    }

    hideContextMenu() {
        this.globalContextMenu.hideContextMenu();
    }

    sendToBack() {
        this.elementCanvasService.sendToBack(this.canvas);
        this.hideContextMenu();
    }

    sendBackward() {
        this.elementCanvasService.sendBackward(this.canvas);
        this.hideContextMenu();
    }

    bringToFront() {
        this.elementCanvasService.bringToFront(this.canvas);
        this.hideContextMenu();
    }

    bringForward() {
        this.elementCanvasService.bringForward(this.canvas);
        this.hideContextMenu();
    }

    edit() {
        // Implement your edit functionality here
        console.log('Edit clicked');
        this.hideContextMenu();
    }

    lock() {
        this.elementCanvasService.lock(this.canvas);
        this.hideContextMenu();
    }

    duplicate() {
        this.elementCanvasService.duplicate(this.canvas, this.workingArea);
        this.hideContextMenu();
    }

    resetAngle() {
        const activeObject = this.canvas.getActiveObject();

        if (activeObject && activeObject.left !== undefined && activeObject.top !== undefined) {
            const boundingBox = activeObject.getBoundingRect();
            const centerX = boundingBox.left + boundingBox.width / 2;
            const centerY = boundingBox.top + boundingBox.height / 2;

            activeObject.angle = 0;
            activeObject.setCoords();

            const newBoundingBox = activeObject.getBoundingRect();
            const newCenterX = newBoundingBox.left + newBoundingBox.width / 2;
            const newCenterY = newBoundingBox.top + newBoundingBox.height / 2;

            activeObject.set({
                left: activeObject.left + (centerX - newCenterX),
                top: activeObject.top + (centerY - newCenterY)
            });

            activeObject.setCoords();
            this.canvas.requestRenderAll();
        }

        this.hideContextMenu();
    }
}
