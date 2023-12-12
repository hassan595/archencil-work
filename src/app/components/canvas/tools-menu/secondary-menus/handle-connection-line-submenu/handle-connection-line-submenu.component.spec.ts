import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandleConnectionLineSubmenuComponent } from './handle-connection-line-submenu.component';

describe('HandleConnectionLineSubmenuComponent', () => {
    let component: HandleConnectionLineSubmenuComponent;
    let fixture: ComponentFixture<HandleConnectionLineSubmenuComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HandleConnectionLineSubmenuComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(HandleConnectionLineSubmenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
