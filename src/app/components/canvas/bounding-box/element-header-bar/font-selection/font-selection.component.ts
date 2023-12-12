import { Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DropdownModelComponent } from '../DropdownModel.component';
import { SharedService } from '../services/element-header-bar.service';
import { CanvasManagerService } from '~components/canvas/services/canvas-manager.service';
import { CustomFabricIText } from '../../../services/wrappers/derived/custom-fabric-itext.part';

@Component({
    selector: 'app-font-selection',
    templateUrl: './font-selection.component.html',
    styleUrls: ['./font-selection.component.scss']
})
export class FontSelectionComponent extends DropdownModelComponent implements OnInit, OnDestroy {
    @Input() headerBar!: HTMLElement;
    @Input() headerBarChange!: EventEmitter<void>;
    protected actionSubscription!: Subscription;

    readonly MENU_ID = 'fontSelectionMenu';

    dropdownAbove: boolean = false; // New property to track the dropdown position
    selectedFont: string = 'Source Sans Pro'; // Default font
    availableFonts: string[] = [
        'Abril Fatface',
        'Bangers',
        'Caveat',
        'EB Garamond',
        'Fredoka One',
        'Graduate',
        'Gravitas One',
        'IBM Plex Mono',
        'IBM Plex Sans',
        'IBM Plex Serif',
        'Lato',
        'Lemon Tuesday',
        'Libre Baskerville',
        'Neuton',
        'Nixie One',
        'Noto Sans',
        'Open Sans',
        'Permanent Marker',
        'PT Sans',
        'PT Sans Narrow',
        'PT Serif',
        'Rammetto One',
        'Roboto',
        'Roboto Condensed',
        'Roboto Slab',
        'Source Sans Pro',
        'Titan One'
    ];
    truncateLength: number = 10; // Variable to determine truncation length

    constructor(protected sharedService: SharedService, private canvasManagerService: CanvasManagerService) {
        super(sharedService);
    }
    ngOnInit() {
        this.actionSubscription = this.headerBarChange.subscribe(() => {
            //console.log('Header Bar Change Event received in FontSizeComponent');

            // Retrieve the active object from the canvas
            const activeObject = this.canvasManagerService.getActiveObject();

            // Check if the active object is a CustomFabricIText instance
            if (activeObject instanceof CustomFabricIText && activeObject.fontFamily) {
                // Get the current font of the active object
                const currentFont = activeObject.fontFamily;

                // Update the selectedFont property with the current font of the active object
                this.selectedFont = currentFont;
            }
        });
    }

    ngOnDestroy() {
        this.actionSubscription.unsubscribe();
    }

    getFontStyle(font: string): { 'font-family': string } {
        return { 'font-family': font };
    }

    toggleDropdown() {
        //console.log("Font-selection dropdown toggled");
        const maxDropdownHeight = 150; // Maximum height of dropdown
        const dropdownHeight = Math.min(this.availableFonts.length * this.dropdownItemHeight, maxDropdownHeight);
        const headerBarRect = this.headerBar.getBoundingClientRect();

        if (window.innerHeight - headerBarRect.bottom < dropdownHeight) {
            if (headerBarRect.top >= dropdownHeight) {
                this.dropdownAbove = true;
            } else {
                this.dropdownAbove = false;
            }
        } else {
            this.dropdownAbove = false;
        }

        //
        this.toggleMenu(this.MENU_ID);
    }

    selectFont(font: string) {
        this.selectedFont = font;
        this.clearCurrentMenu();

        // Retrieve the active object from the canvas
        const activeObject = this.canvasManagerService.getActiveObject();

        // Check if the active object is a CustomFabricIText instance and selectedFont is defined
        if (activeObject instanceof CustomFabricIText && this.selectedFont) {
            // Use the new method to change the font
            activeObject.changeFontFamily(this.selectedFont);

            // Reset text styling
            activeObject.set({
                fontWeight: 'normal',
                fontStyle: 'normal',
                underline: false,
                linethrough: false
            });

            // Rerender the CanvasComponent to reflect the font change and reset styles
            CanvasManagerService.canvas!.renderAll();
        }
    }
}
