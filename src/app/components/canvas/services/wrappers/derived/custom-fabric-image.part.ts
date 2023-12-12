import { fabric } from 'fabric';

export class CustomFabricImage extends fabric.Image {
    manual: boolean;
    id: string;
    selected: boolean;

    constructor(element: HTMLImageElement, options?: fabric.IImageOptions) {
        super(element, options);
        this.manual = false;
        this.id = '';
        this.selected = false;
    }
}
