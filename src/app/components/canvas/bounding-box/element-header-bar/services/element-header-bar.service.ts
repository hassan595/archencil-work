import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SharedService {
    elementHeaderBarClosed: EventEmitter<void> = new EventEmitter();
    closeAllSubmenus: EventEmitter<void> = new EventEmitter();

    constructor() {}
}
