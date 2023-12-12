import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchTypeComponent } from './switch-type.component';

describe('SwitchTypeComponent', () => {
    let component: SwitchTypeComponent;
    let fixture: ComponentFixture<SwitchTypeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SwitchTypeComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(SwitchTypeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
