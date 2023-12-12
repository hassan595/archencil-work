import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CanvasManagerService } from '../../../services/canvas-manager.service';
import { CustomFabricIText } from '../../../services/wrappers/derived/custom-fabric-itext.part';
import { DropdownModelComponent } from '../DropdownModel.component';
import { SharedService } from '../services/element-header-bar.service';

@Component({
    selector: 'app-text-changes',
    templateUrl: './text-changes.component.html',
    styleUrls: ['./text-changes.component.scss']
})
export class TextChangesComponent extends DropdownModelComponent implements OnInit {
    @Input() headerBar!: HTMLElement;
    protected actionSubscription!: Subscription;

    readonly MENU_ID = 'textChangesMenu';

    dropdownAbove: boolean = false; // New property to track the dropdown position
    dropdownLeft: string = '0';
    linkFieldTop: string = '0px';

    constructor(
        protected sharedService: SharedService,
        private canvasManagerService: CanvasManagerService
    ) {
        super(sharedService);
    }

    // New method to toggle the dropdown position
    // Em text-changes.component.ts

    toggleDropdown(fromMultiple?: boolean): void {}

    toggleLinkField(event: Event): void {
        event.stopPropagation();

        DropdownModelComponent.currentMenu = this.MENU_ID;

        if (this.activeMenu !== 'linkField') {
            this.activeMenu = 'linkField';
        } else {
            if (DropdownModelComponent.currentMenu != DropdownModelComponent.lastCurrentMenu) {
                this.activeMenu = 'linkField';
            } else {
                this.activeMenu = '';
            }
        }

        if (this.headerBar) {
            const height = this.headerBar.clientHeight;
            document.documentElement.style.setProperty('--header-bar-height', `${height}px`);
        }

        this.setLinkFieldPosition();

        //this.toggleDropdown(true); // Necessary to pass activeMenu to DropdownModel.component.ts
    }

    closeLinkField(event: Event): void {
        event.stopPropagation();
        this.activeMenu = '';
    }

    setLinkFieldPosition(): void {
        const headerBarRect = this.headerBar.getBoundingClientRect();
        const linkFieldWidth = 300; // The width of the link field as defined in your CSS
        const leftPosition = headerBarRect.left + headerBarRect.width / 2 - linkFieldWidth / 2;
        this.linkFieldTop = `${headerBarRect.bottom + 40}px`; // Increase this value to add more space
        document.documentElement.style.setProperty('--header-bar-bottom', this.linkFieldTop);
        document.documentElement.style.setProperty('--link-field-left', `${leftPosition}px`);
    }

    toggleBold(): void {
        const activeObject = this.canvasManagerService.getActiveObject();
        if (activeObject instanceof CustomFabricIText) {
            activeObject.toggleBold();
            CanvasManagerService.canvas!.renderAll();
        }
    }

    toggleItalic(): void {
        const activeObject = this.canvasManagerService.getActiveObject();
        if (activeObject instanceof CustomFabricIText) {
            activeObject.toggleItalic();
            CanvasManagerService.canvas!.renderAll();
        }
    }

    toggleUnderline(): void {
        const activeObject = this.canvasManagerService.getActiveObject();
        if (activeObject instanceof CustomFabricIText) {
            activeObject.toggleUnderline();
            CanvasManagerService.canvas!.renderAll();
        }
    }

    toggleStrikethrough(): void {
        const activeObject = this.canvasManagerService.getActiveObject();
        if (activeObject instanceof CustomFabricIText) {
            activeObject.toggleStrikethrough();
            CanvasManagerService.canvas!.renderAll();
        }
    }
}
