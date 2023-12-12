import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { DropdownModelComponent } from '../DropdownModel.component';

@Component({
    selector: 'app-text-colors',
    templateUrl: './text-colors.component.html',
    styleUrls: ['./text-colors.component.scss']
})
export class TextColorsComponent extends DropdownModelComponent {
    @Input() headerBar!: HTMLElement;
    protected actionSubscription!: Subscription;

    readonly MENU_ID = 'textColorsMenu';

    //activeMenu: string = '';

    dropdownAbove: boolean = false;
    dropdownLeft: string = '0';
    showLinkField: boolean = false;
    linkFieldTop: string = '0px';

    defaultBorderColor: string = this.getDarkerColor('#ffffff'); // Assuming white is your default color

    color_text_menu: string = '#ffffff';
    // prettier-ignore
    colors_text_menu: string[] = [
        '#ffffff', '#fef445', '#fac710', '#f24726',
        '#e6e6e6', '#cee741', '#8fd14f', '#da0063',
        '#808080', '#12cdd4', '#0ca789', '#652cb3',
        '#1a1a1a', '#2d9bf0', '#414bb2', '#9510ac',
        '#ff0000', '#4d1414', '#644444'
    ];

    color_highlight_menu: string = '#ffffff';
    // prettier-ignore
    colors_highlight_menu: string[] = [
        '', '#ffffff', '#fef445', '#fac710', '#f24726',
        '#e6e6e6', '#cee741', '#8fd14f', '#da0063',
        '#808080', '#12cdd4', '#0ca789', '#652cb3',
        '#1a1a1a', '#2d9bf0', '#414bb2', '#9510ac',
        '#ff0000', '#4d1414', '#644444'
    ];

    // New method to toggle the dropdown position
    toggleDropdown(fromMultiple?: boolean) {}

    getDarkerColor(color: string): string {
        let r: number = parseInt(color.substring(1, 3), 16);
        let g: number = parseInt(color.substring(3, 5), 16);
        let b: number = parseInt(color.substring(5, 7), 16);

        r = Math.round(r * 0.8);
        g = Math.round(g * 0.8);
        b = Math.round(b * 0.8);

        return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
    }

    addColor(menu: string): void {
        if (menu === 'fontStyle') {
            this.colors_text_menu.push(this.color_text_menu);
        } else if (menu === 'alignment') {
            this.colors_highlight_menu.push(this.color_highlight_menu); // Assuming you have a separate array for highlight colors
        }
    }

    colorPickerClicked(event: Event): void {
        event.stopPropagation(); // Prevents the dropdown from closing when the color picker is clicked
    }
}
