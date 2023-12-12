import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextColorsComponent } from './text-colors.component';

describe('TextColorsComponent', () => {
    let component: TextColorsComponent;
    let fixture: ComponentFixture<TextColorsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TextColorsComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(TextColorsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
