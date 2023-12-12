import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalContextMenuComponent } from './global-context-menu.component';

describe('GlobalContextMenuComponent', () => {
    let component: GlobalContextMenuComponent;
    let fixture: ComponentFixture<GlobalContextMenuComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GlobalContextMenuComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(GlobalContextMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
