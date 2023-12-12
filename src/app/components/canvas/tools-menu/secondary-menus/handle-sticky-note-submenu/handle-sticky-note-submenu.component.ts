import { AfterViewInit, Component, OnInit, ElementRef, Renderer2, Input } from '@angular/core';

interface Option {
    name: string;
    color: string;
}

@Component({
    selector: 'app-handle-sticky-note-submenu',
    templateUrl: './handle-sticky-note-submenu.component.html',
    styleUrls: ['./handle-sticky-note-submenu.component.scss']
})
export class HandleStickyNoteSubmenuComponent implements OnInit, AfterViewInit {
    options!: Option[];
    color = '#FFD700'; // default color
    @Input() currentIndex!: number; // Use definite assignment assertion
    @Input() positionY!: number; // Use definite assignment assertion if not initialized
    @Input() toolsMenuHeight!: number; // Use definite assignment assertion if not initialized

    // eslint-disable-next-line no-unused-vars
    constructor(
        // eslint-disable-next-line no-unused-vars
        private renderer: Renderer2,
        // eslint-disable-next-line no-unused-vars
        private elementRef: ElementRef
    ) {}

    // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
    ngOnInit(): void {
        this.execute();
    }

    execute() {
        this.options = [
            { name: 'color1', color: '#FFD700' }, // Gold
            { name: 'color2', color: '#FFC0CB' }, // Pink
            { name: 'color3', color: '#ADFF2F' }, // GreenYellow
            { name: 'color4', color: '#0000FF' }, // Blue
            { name: 'color5', color: '#FF00FF' }, // Fuchsia
            { name: 'color6', color: '#00FFFF' }, // Aqua
            { name: 'color7', color: '#800080' }, // Purple
            { name: 'color8', color: '#FF0000' }, // Red
            { name: 'color9', color: '#FFFF00' }, // Yellow
            { name: 'color10', color: '#008000' }, // Green
            { name: 'color11', color: '#000080' }, // Navy
            { name: 'color12', color: '#808080' }, // Gray
            { name: 'color13', color: '#800000' }, // Maroon
            { name: 'color14', color: '#008080' }, // Teal
            { name: 'color15', color: '#C0C0C0' }, // Silver
            { name: 'color16', color: '#000000' } // Black
        ];
    }

    onColorSelect(color: string) {
        this.color = color;
        console.log(color);
    }

    // eslint-disable-next-line no-dupe-class-members
    ngAfterViewInit(): void {
        this.verticallyCentralize();
    }

    verticallyCentralize() {
        const submenuElement = this.elementRef.nativeElement.querySelector('.submenu');
        if (submenuElement) {
            const optionsMenu = submenuElement.parentElement.parentElement;
            const submenuHeight = optionsMenu.offsetHeight;
            //console.log('Offset Height:', submenuHeight);

            if (this.positionY !== undefined) {
                const offset = -submenuHeight + 100;
                const verticalPos = this.positionY + submenuHeight / 2 - this.toolsMenuHeight / 2 + offset;
                //const verticalPos = elementHeight;
                //console.log('this.positionY', this.positionY);

                this.renderer.setStyle(optionsMenu, 'top', `${verticalPos}px`);
                //this.renderer.setStyle(optionsMenu, 'transform', `translateY(0)`);
                //console.log('toolsMenuHeight', this.toolsMenuHeight);
            }
        } else {
            console.error('nothing found');
        }
    }
}
