import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandleDrawingSubmenuComponent } from './handle-drawing-submenu.component';

describe('HandleDrawingSubmenuComponent', () => {
    let component: HandleDrawingSubmenuComponent;
    let fixture: ComponentFixture<HandleDrawingSubmenuComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HandleDrawingSubmenuComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(HandleDrawingSubmenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
