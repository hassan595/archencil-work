import { fabric } from 'fabric';

export class CustomFabricText extends fabric.Text {
    manual: boolean;
    id: string;
    selected: boolean;

    constructor(text: string, options?: fabric.ITextOptions) {
        super(text, options);
        this.manual = false;
        this.id = '';
        this.selected = false;
    }
}
