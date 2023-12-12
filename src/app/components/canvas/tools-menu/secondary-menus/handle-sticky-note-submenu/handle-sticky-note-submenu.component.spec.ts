import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandleStickyNoteSubmenuComponent } from './handle-sticky-note-submenu.component';

describe('HandleStickyNoteSubmenuComponent', () => {
    let component: HandleStickyNoteSubmenuComponent;
    let fixture: ComponentFixture<HandleStickyNoteSubmenuComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HandleStickyNoteSubmenuComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(HandleStickyNoteSubmenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
