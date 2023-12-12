import { AfterViewInit, Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from './services/element-header-bar.service';
import { Subscription } from 'rxjs';

@Directive()
export abstract class DropdownModelComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() headerBar!: HTMLElement;
    //showDropdown: boolean = false;
    //dropdownAbove: boolean = false;
    dropdownItemHeight: number = 30;
    activeMenu: string = '';
    static currentMenu: string = '';
    static lastCurrentMenu: string = '';

    private headerBarClosedSubscription!: Subscription;
    private closeAllSubmenusSubscription!: Subscription;

    // Store a reference to the original toggleDropdown method
    private originalToggleDropdown: (fromMultiple?: boolean) => void;

    constructor(protected sharedService: SharedService) {
        // Bind the original toggleDropdown method
        this.originalToggleDropdown = this.toggleDropdown.bind(this);
    }

    toggleOption(option: string, menuId: string) {

        if (option != this.activeMenu && option != '') {
            this.activeMenu = option;
        } else {
            if(DropdownModelComponent.currentMenu == menuId){
                this.activeMenu = '';
            }
        }

        DropdownModelComponent.currentMenu = menuId;
    }

    toggleMenu(menu: string)
    {
        /*console.log('lastCurrentMenu', DropdownModelComponent.lastCurrentMenu);
        console.log('currentMenu', DropdownModelComponent.currentMenu);
        console.log('menu', menu);
        console.log('----------------------------');*/

        // This means the user just wants to toggle the current menu
        if (DropdownModelComponent.lastCurrentMenu === DropdownModelComponent.currentMenu) {
            if (menu == DropdownModelComponent.currentMenu) {
                DropdownModelComponent.currentMenu = '';
            }
            // The menu has been changed
            else if (menu != DropdownModelComponent.currentMenu) {
                DropdownModelComponent.currentMenu = menu;
                DropdownModelComponent.lastCurrentMenu = menu;
            }
        } else if (DropdownModelComponent.lastCurrentMenu !== DropdownModelComponent.currentMenu) {
            DropdownModelComponent.currentMenu = menu;
            DropdownModelComponent.lastCurrentMenu = menu;
        }
    }

    clearCurrentMenu()
    {
        DropdownModelComponent.currentMenu = '';
    }

    get getCurrentMenu(): string {
        return DropdownModelComponent.currentMenu;
    }

    ngOnInit() {
        this.headerBarClosedSubscription = this.sharedService.elementHeaderBarClosed.subscribe(() => {
            //console.log("Element-header-bar closed: triggered.");
            this.clearCurrentMenu();
        });
    }

    ngOnDestroy() {
        if (this.headerBarClosedSubscription) {
            this.headerBarClosedSubscription.unsubscribe();
        }
    }

    ngAfterViewInit() {
        // Override toggleDropdown with new logic
        this.toggleDropdown = (fromMultiple: boolean = false) => {
            //console.log('fromMultiple', fromMultiple);

            // Toggling dropdown using the stored original method
            this.originalToggleDropdown(fromMultiple);
        };
    }

    abstract toggleDropdown(fromMultiple?: boolean): void;


}
