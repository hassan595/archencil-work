import { fabric } from 'fabric';

export class CustomFabricActiveSelection extends fabric.ActiveSelection {
    manual: boolean;
    id: string;
    selected: boolean;

    constructor(objects: fabric.Object[], options?: fabric.IObjectOptions) {
        super(objects, options);
        this.manual = false;
        this.id = Math.random().toString(36).substring(2); // Assign a random id property
        this.selected = false;
    }
}
