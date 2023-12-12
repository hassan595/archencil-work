import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandleTemplatesSubmenuComponent } from './handle-templates-submenu.component';

describe('HandleTemplatesSubmenuComponent', () => {
    let component: HandleTemplatesSubmenuComponent;
    let fixture: ComponentFixture<HandleTemplatesSubmenuComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HandleTemplatesSubmenuComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(HandleTemplatesSubmenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
