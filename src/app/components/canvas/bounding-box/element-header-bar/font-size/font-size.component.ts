import { Component, EventEmitter, Input, OnDestroy, OnInit, NgZone } from '@angular/core';
import { DropdownModelComponent } from '../DropdownModel.component';
import { Subscription } from 'rxjs';
import { SharedService } from '../services/element-header-bar.service';
import { CanvasManagerService } from '../../../services/canvas-manager.service';
import { CustomFabricIText } from '../../../services/wrappers/derived/custom-fabric-itext.part';

@Component({
    selector: 'app-font-size',
    templateUrl: './font-size.component.html',
    styleUrls: ['./font-size.component.scss']
})
export class FontSizeComponent extends DropdownModelComponent implements OnInit, OnDestroy {
    @Input() headerBar!: HTMLElement;
    @Input() headerBarChange!: EventEmitter<void>;
    protected actionSubscription!: Subscription;

    readonly MENU_ID = 'fontSizeMenu';

    dropdownAbove: boolean = false; // New property to track the dropdown position
    fontSize: number = 14; // Default font size
    availableFontSizes: number[] = [10, 12, 14, 18, 24, 36, 48, 64, 80, 144, 288];

    constructor(
        protected sharedService: SharedService,
        private canvasManagerService: CanvasManagerService,
        private ngZone: NgZone
    ) {
        super(sharedService);
    }

    ngOnInit() {
        this.actionSubscription = this.headerBarChange.subscribe(() => {
            const activeObject = this.canvasManagerService.getActiveObject();
            if (activeObject instanceof CustomFabricIText && activeObject.fontSize) {
                this.fontSize = activeObject.fontSize;
            }
        });

        // Listen to object modification events on the canvas
        CanvasManagerService.canvas!.on('object:modified', (e) => {
            const activeObject = e.target;
            if (activeObject instanceof CustomFabricIText) {
                // Update fontSize based on the scaled size
                this.updateFontSizeFromObject(activeObject);
            }
        });
    }

    updateFontSizeFromObject(textObject: CustomFabricIText) {
        const fontSize = textObject.fontSize ?? 14;
        const scaleX = textObject.scaleX ?? 1;

        if (scaleX !== 1) {
            let scaledFontSize = fontSize * scaleX;

            // Constrain the font size within the specified range
            scaledFontSize = Math.max(10, Math.min(scaledFontSize, 288));

            this.ngZone.run(() => {
                this.fontSize = Math.round(scaledFontSize);
                this.applyFontSize(this.fontSize);

                // Reset scale factors
                textObject.scaleX = 1;
                textObject.scaleY = 1;
                textObject.setCoords();
            });
        }
    }

    ngOnDestroy() {
        super.ngOnDestroy(); // If there's logic in the parent class
        this.actionSubscription.unsubscribe();
        CanvasManagerService.canvas!.off('object:modified');
    }

    toggleDropdown() {
        const totalDropdownHeight = this.availableFontSizes.length * this.dropdownItemHeight;
        const headerBarRect = this.headerBar.getBoundingClientRect();
        this.dropdownAbove =
            window.innerHeight - headerBarRect.bottom < totalDropdownHeight && headerBarRect.top >= totalDropdownHeight;
        this.toggleMenu(this.MENU_ID);
    }

    increaseFontSize() {
        // Find the next font size greater than the current font size
        const nextSize = this.availableFontSizes.find(size => size > this.fontSize);
        if (nextSize !== undefined) {
            this.fontSize = nextSize;
        }
        this.applyFontSize(this.fontSize);
    }

    decreaseFontSize() {
        // Find the next font size smaller than the current font size
        const nextSize = [...this.availableFontSizes].reverse().find(size => size < this.fontSize);
        if (nextSize !== undefined) {
            this.fontSize = nextSize;
        }
        this.applyFontSize(this.fontSize);
    }

    findClosestFontSize(targetSize: number): number {
        return this.availableFontSizes.reduce((prev, curr) =>
            Math.abs(curr - targetSize) < Math.abs(prev - targetSize) ? curr : prev
        );
    }

    onFontSizeChange(event: Event) {
        const target = event.target as HTMLInputElement;
        const newValue = target.value;
        const newFontSize = parseInt(newValue, 10);
        if (!isNaN(newFontSize)) {
            if (newFontSize < 10) {
                this.fontSize = 10;
            } else if (newFontSize > 288) {
                this.fontSize = 288;
            } else {
                this.fontSize = newFontSize;
            }
            this.applyFontSize(this.fontSize);
        }
    }

    applyFontSize(size: number) {
        const activeObject = this.canvasManagerService.getActiveObject();
        if (activeObject instanceof CustomFabricIText && size) {
            activeObject.set('fontSize', size);
            CanvasManagerService.canvas!.renderAll();
        }
    }

    selectSize(size: number) {
        this.fontSize = size;
        this.clearCurrentMenu();
        this.applyFontSize(this.fontSize);
    }
}
