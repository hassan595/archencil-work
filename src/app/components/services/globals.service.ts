import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class GlobalsService {
    private globals: { [key: string]: any } = {};

    setGlobal(name: string, value: any) {
        this.globals[name] = value;
    }

    getGlobal(name: string) {
        return this.globals[name];
    }
}
