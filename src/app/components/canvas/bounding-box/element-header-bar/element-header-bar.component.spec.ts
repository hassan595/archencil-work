import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementHeaderBarComponent } from './element-header-bar.component';

describe('ElementHeaderBarComponent', () => {
    let component: ElementHeaderBarComponent;
    let fixture: ComponentFixture<ElementHeaderBarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ElementHeaderBarComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(ElementHeaderBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
