import { fabric } from 'fabric';

export class CustomFabricActiveObject extends fabric.Object {
    manual: boolean;
    id: string;
    selected: boolean;
    mode: string;
    color: string;
    syncExclude: boolean;
    constrained: boolean;
    top: number;
    left: number;

    constructor(object: fabric.Object) {
        super(object.toObject());
        this.manual = false;
        this.id = Math.random().toString(36).substring(2); // Assign a random id property
        this.selected = false;
        this.mode = '';
        this.color = '';
        this.syncExclude = false;
        this.constrained = false;
        this.top = object.top || 0; // Default value for top
        this.left = object.left || 0; // Default value for left
    }
}
