import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { DropdownModelComponent } from '../DropdownModel.component';

@Component({
    selector: 'app-box-colors',
    templateUrl: './box-colors.component.html',
    styleUrls: ['./box-colors.component.scss']
})
export class BoxColorsComponent extends DropdownModelComponent {
    @Input() headerBar!: HTMLElement;
    protected actionSubscription!: Subscription;

    dropdownAbove: boolean = false; // New property to track the dropdown position
    truncateLength: number = 10; // Variable to determine truncation length

    readonly MENU_ID = 'boxColorsMenu';

    toggleDropdown(fromMultiple?: boolean) {
        const maxDropdownHeight = 150; // Maximum height of dropdown
        const dropdownHeight = Math.min(this.dropdownItemHeight, maxDropdownHeight);
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

        this.toggleMenu(this.MENU_ID);
    }
}
