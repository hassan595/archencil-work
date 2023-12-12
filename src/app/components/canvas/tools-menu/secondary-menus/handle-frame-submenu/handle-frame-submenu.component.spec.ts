import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandleFrameSubmenuComponent } from './handle-frame-submenu.component';

describe('HandleFrameSubmenuComponent', () => {
    let component: HandleFrameSubmenuComponent;
    let fixture: ComponentFixture<HandleFrameSubmenuComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HandleFrameSubmenuComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(HandleFrameSubmenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
