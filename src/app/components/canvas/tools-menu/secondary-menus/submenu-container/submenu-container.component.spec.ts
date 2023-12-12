import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmenuContainerComponent } from './submenu-container.component';

describe('SubmenuContainerComponent', () => {
    let component: SubmenuContainerComponent;
    let fixture: ComponentFixture<SubmenuContainerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SubmenuContainerComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(SubmenuContainerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
