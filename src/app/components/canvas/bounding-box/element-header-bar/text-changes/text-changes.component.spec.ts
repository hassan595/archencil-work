import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextChangesComponent } from './text-changes.component';

describe('TextChangesComponent', () => {
    let component: TextChangesComponent;
    let fixture: ComponentFixture<TextChangesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TextChangesComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(TextChangesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
