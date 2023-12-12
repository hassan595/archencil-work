import { fabric } from 'fabric';

export class CustomFabricCircle extends fabric.Circle {
    manual: boolean;
    id: string;
    selected: boolean;
    mode: string;
    color: string;
    syncExclude: boolean;
    constrained: boolean;

    constructor(
        options?: fabric.ICircleOptions & {
            mode?: string;
            color?: string;
            syncExclude?: boolean;
            constrained?: boolean;
        }
    ) {
        super({
            radius: 0,
            stroke: 'blue',
            strokeWidth: 2,
            fill: 'transparent',
            selectable: true,
            evented: true,
            opacity: 1,
            ...options
        });
        this.manual = false;
        this.id = Math.random().toString(36).substring(2); // Assign a random id property
        this.selected = false;
        this.mode = options?.mode || '';
        this.color = options?.color || '';
        this.syncExclude = options?.syncExclude || false;
        this.constrained = options?.constrained || false;
    }
}
