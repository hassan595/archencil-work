import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { DropdownModelComponent } from '../DropdownModel.component';

@Component({
    selector: 'app-switch-type',
    templateUrl: './switch-type.component.html',
    styleUrls: ['./switch-type.component.scss']
})
export class SwitchTypeComponent extends DropdownModelComponent {
    @Input() headerBar!: HTMLElement;
    protected actionSubscription!: Subscription;

    readonly MENU_ID = 'switchTypeMenu';

    dropdownAbove: boolean = false; // New property to track the dropdown position
    truncateLength: number = 10; // Variable to determine truncation length

    toggleDropdown() {
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

        //
        this.toggleMenu(this.MENU_ID);
    }

}
