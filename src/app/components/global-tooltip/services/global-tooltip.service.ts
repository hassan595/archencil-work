import { Injectable, ComponentRef, ViewContainerRef, EmbeddedViewRef } from '@angular/core';
import { GlobalTooltipComponent } from '../global-tooltip.component';

@Injectable({
    providedIn: 'root'
})
export class GlobalTooltipService {
    constructor() {}

    createTooltip(viewContainerRef: ViewContainerRef): ComponentRef<GlobalTooltipComponent> {
        const componentRef = viewContainerRef.createComponent(GlobalTooltipComponent);
        const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        document.body.appendChild(domElem);
        return componentRef;
    }

    destroyTooltip(componentRef: ComponentRef<GlobalTooltipComponent>): void {
        componentRef.destroy();
    }
}
