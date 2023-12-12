import { fabric } from 'fabric';

export class CustomFabricObject extends fabric.Object {
    manual: boolean;
    id: string;
    selected: boolean;

    constructor(object: fabric.Object, options?: fabric.IObjectOptions) {
        super({ ...object.toObject(), ...options });
        this.manual = false;
        this.id = Math.random().toString(36).substring(2); // Assign a random id property
        this.selected = false;
    }
}
