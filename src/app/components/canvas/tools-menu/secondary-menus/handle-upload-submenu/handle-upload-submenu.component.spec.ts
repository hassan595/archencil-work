import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandleUploadSubmenuComponent } from './handle-upload-submenu.component';

describe('HandleUploadSubmenuComponent', () => {
    let component: HandleUploadSubmenuComponent;
    let fixture: ComponentFixture<HandleUploadSubmenuComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HandleUploadSubmenuComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(HandleUploadSubmenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
