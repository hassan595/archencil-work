import { fabric } from 'fabric';

export class CustomFabricRect extends fabric.Rect {
    manual: boolean;
    id: string;
    selected: boolean;
    mode: string;
    color: string;
    syncExclude: boolean;
    constrained: boolean;

    constructor(
        options?: fabric.IRectOptions & { mode?: string; color?: string; syncExclude?: boolean; constrained?: boolean }
    ) {
        super(options);
        this.manual = false;
        this.id = Math.random().toString(36).substring(2); // Assign a random id property
        this.selected = false;
        this.mode = options?.mode || '';
        this.color = options?.color || '';
        this.syncExclude = options?.syncExclude || false;
        this.constrained = options?.constrained || false;
    }
}
