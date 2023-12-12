import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxColorsComponent } from './box-colors.component';

describe('BoxColorsComponent', () => {
    let component: BoxColorsComponent;
    let fixture: ComponentFixture<BoxColorsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BoxColorsComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(BoxColorsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
