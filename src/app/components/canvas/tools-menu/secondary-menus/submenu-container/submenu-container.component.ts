import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, HostBinding } from '@angular/core';
import { VisualConfigGenerator } from 'app/shared/components/styles/visual-config-generator';

@Component({
    selector: 'app-submenu-container',
    templateUrl: './submenu-container.component.html',
    styleUrls: ['./submenu-container.component.scss']
})
export class SubmenuContainerComponent implements OnInit, AfterViewInit {
    @HostBinding('style.display') display!: string;

    constructor(
        // eslint-disable-next-line no-unused-vars
        private elementRef: ElementRef,
        // eslint-disable-next-line no-unused-vars
        private renderer: Renderer2
    ) {}

    // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
    ngOnInit(): void {
        this.beginInitialStyle();
    }

    // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
    ngAfterViewInit(): void {}

    beginInitialStyle(): void {
        const values = VisualConfigGenerator.getConfig('tools-menu');

        // Get all elements with the class name 'options-menu'
        const optionsMenus = this.elementRef.nativeElement.querySelectorAll('.options-menu');

        // Iterate through each options menu and apply the styles
        optionsMenus.forEach((optionsMenu: Element) => {
            this.renderer.setStyle(optionsMenu, 'box-shadow', values.boxShadowValue);
            this.renderer.setStyle(optionsMenu, 'z-index', values.zIndex);
        });
    }
}
