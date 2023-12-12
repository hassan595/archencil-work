import { AfterViewInit, Component, ElementRef, Input, Renderer2, ViewContainerRef } from '@angular/core';
import { EntityHandlerService } from '../services/entity-handler.service';
import { CanvasManagerService } from '~components/canvas/services/canvas-manager.service';
import { fabric } from 'fabric';
import { VisualConfigGenerator } from 'app/shared/components/styles/visual-config-generator';
import { HandleTemplatesSubmenuComponent } from './secondary-menus/handle-templates-submenu/handle-templates-submenu.component';

// eslint-disable-next-line no-unused-vars
enum SubmenuType {
    // eslint-disable-next-line no-unused-vars
    None,
    // eslint-disable-next-line no-unused-vars
    StickyNote,
    // eslint-disable-next-line no-unused-vars
    Shape,
    // eslint-disable-next-line no-unused-vars
    ConnectionLine,
    // eslint-disable-next-line no-unused-vars
    Drawing,
    // eslint-disable-next-line no-unused-vars
    Frame,
    // eslint-disable-next-line no-unused-vars
    Upload,
    // eslint-disable-next-line no-unused-vars
    More
}

@Component({
    selector: 'app-tools-menu',
    templateUrl: './tools-menu.component.html',
    styleUrls: ['./tools-menu.component.scss']
})
export class ToolsMenuComponent implements AfterViewInit {
    @Input() canvas!: fabric.Canvas;

    iter: number = -1;

    DEFAULT_OPTION = 'Select';
    static currentSelected = 'select';

    currentSubmenu: SubmenuType = SubmenuType.None;

    positionY: number = 0;
    toolsMenuHeight: number = 0;

    // This is the enum made available to your template
    SubmenuType = SubmenuType;

    buttons = [
        { name: 'Select', icon: 'cursor.svg', alt: 'Select' },
        { name: 'Templates', icon: 'photo-edit.svg', alt: 'Templates' },
        { name: 'Text', icon: 'font.svg', alt: 'Text' },
        { name: 'Sticky note', icon: 'sticky-note.svg', alt: 'Sticky note' },
        { name: 'Shape', icon: 'shapes.svg', alt: 'Shape' },
        { name: 'Connection line', icon: 'curved-arrow.svg', alt: 'Connection line' },
        { name: 'Drawing', icon: 'pen.svg', alt: 'Pen' },
        { name: 'Comment', icon: 'comment.svg', alt: 'Comment' },
        { name: 'Frame', icon: 'capture.svg', alt: 'Frame' },
        { name: 'Upload', icon: 'upload-file.svg', alt: 'Upload' },
        { name: 'More', icon: 'new-page.svg', alt: 'More' }
    ];

    buttons_2 = [
        { name: 'Undo', icon: 'undo.svg', alt: 'Undo' },
        { name: 'Redo', icon: 'undo-1.svg', alt: 'Redo' }
    ];

    constructor(
        private entityHandlerService: EntityHandlerService,
        private canvasManagerService: CanvasManagerService,
        private elementRef: ElementRef,
        private renderer: Renderer2,
        private viewContainerRef: ViewContainerRef
    ) {
        this.onButtonClick(this.DEFAULT_OPTION);
    }

    ngAfterViewInit() {
        this.beginInitialStyle();
    }

    beginInitialStyle() {
        const values = VisualConfigGenerator.getConfig('tools-menu');
        const toolsMenus = this.elementRef.nativeElement.querySelectorAll('.tools-menu');

        for (const toolsMenu of toolsMenus) {
            //this.renderer.setStyle(toolsMenu, 'display', 'none');
            this.renderer.setStyle(toolsMenu, 'box-shadow', values.boxShadowValue);
            this.renderer.setStyle(toolsMenu, 'z-index', values.zIndex);
        }
    }

    onButtonClick(name: string, iter?: number, event?: MouseEvent) {
        this.currentSubmenu = SubmenuType.None;
        this.iter = iter ?? this.iter;

        if (event) {
            const element = event.target as HTMLElement;
            const rect = element.getBoundingClientRect();
            const yPosition = rect.top + document.documentElement.scrollTop;

            // Create a new div element for the red square
            let redSquareDebug = document.createElement('div');

            // Set styles for the red square
            redSquareDebug.style.width = '50px';
            redSquareDebug.style.height = '50px';
            redSquareDebug.style.backgroundColor = 'red';
            redSquareDebug.style.position = 'absolute';
            redSquareDebug.style.left = '0px'; // Or specify any horizontal position you want
            redSquareDebug.style.top = `${yPosition}px`; // Position it at yPosition

            // Append the red square to the body of the document
            //document.body.appendChild(redSquareDebug);

            this.positionY = yPosition;

            // Select the tools-menu-container element by its class
            const toolsMenuContainer = document.querySelector('.tools-menu-container') as HTMLElement;

            // Check if the element exists to avoid errors
            if (toolsMenuContainer) {
                // Get the height of the tools-menu-container
                const toolsMenuContainerHeight = toolsMenuContainer.offsetHeight;
                // Do something with toolsMenuContainerHeight
                this.toolsMenuHeight = toolsMenuContainerHeight;
            }
        }

        if (this.canvas) {
            this.canvasManagerService.discardAllSelection();
        }

        if (name == 'Select') {
            this.canvasManagerService.resetCursorStyle();
        } else if (name == 'Templates') {
            this.canvasManagerService.resetCursorStyle();
        } else if (name == 'Text') {
            //const options = { width: 18, height: 18, offsetX: 9, offsetY: 9 };
            this.canvasManagerService.setCursorStyle('text-editor');
        } else if (name == 'Sticky note') {
            this.canvasManagerService.setCursorStyle('sticky-note');
            this.currentSubmenu = SubmenuType.StickyNote;
        } else if (name == 'Shape') {
            //const options = { width: 24, height: 24, offsetX: 12, offsetY: 12 };
            this.canvasManagerService.setCursorStyle('crosshair');
            this.currentSubmenu = SubmenuType.Shape;
        } else if (name == 'Connection line') {
            //const options = { width: 24, height: 24, offsetX: 12, offsetY: 12 };
            this.canvasManagerService.setCursorStyle('crosshair-1');
            this.currentSubmenu = SubmenuType.ConnectionLine;
        } else if (name == 'Drawing') {
            //const options = { width: 24, height: 24, offsetX: 0, offsetY: 22 };
            this.canvasManagerService.setCursorStyle('pencil');
            this.currentSubmenu = SubmenuType.Drawing;
        } else if (name == 'Comment') {
            //const options = { width: 24, height: 24, offsetX: 4, offsetY: 21 };
            this.canvasManagerService.setCursorStyle('comment');
        } else if (name == 'Frame') {
            //const options = { width: 24, height: 24, offsetX: 12, offsetY: 12 };
            this.canvasManagerService.setCursorStyle('crosshair-2');
            this.currentSubmenu = SubmenuType.Frame;
        } else if (name == 'Upload') {
            //const options = { width: 24, height: 24, offsetX: 12, offsetY: 12 };
            this.canvasManagerService.setCursorStyle('crosshair-2');
            this.currentSubmenu = SubmenuType.Upload;
        } else if (name == 'More') {
            //const options = { width: 24, height: 24, offsetX: 12, offsetY: 12 };
            //this.canvasManagerService.setCursorStyle('crosshair-2');
            this.currentSubmenu = SubmenuType.More;
        } else {
            console.warn(`Unhandled button name: ${name}`);
        }

        ToolsMenuComponent.currentSelected = name;
    }

    onButtonClick_2(name: string) {
        if (name == 'Undo') {
            console.log('Undo');
        } else if (name == 'Redo') {
            console.log('Redo');
        } else {
            console.warn(`Unhandled button name: ${name}`);
        }
    }

    public getCurrentSelected() {
        return ToolsMenuComponent.currentSelected;
    }
}
