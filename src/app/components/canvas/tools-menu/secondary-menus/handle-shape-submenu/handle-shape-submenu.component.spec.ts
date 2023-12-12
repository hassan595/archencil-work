import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandleShapeSubmenuComponent } from './handle-shape-submenu.component';

describe('HandleShapeSubmenuComponent', () => {
    let component: HandleShapeSubmenuComponent;
    let fixture: ComponentFixture<HandleShapeSubmenuComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HandleShapeSubmenuComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(HandleShapeSubmenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
