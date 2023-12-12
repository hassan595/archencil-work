import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandleMoreSubmenuComponent } from './handle-more-submenu.component';

describe('HandleMoreSubmenuComponent', () => {
    let component: HandleMoreSubmenuComponent;
    let fixture: ComponentFixture<HandleMoreSubmenuComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HandleMoreSubmenuComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(HandleMoreSubmenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
