import { TestBed } from '@angular/core/testing';
import { ZIndexManagerService } from './zindex-manager.service';

describe('ZindexManagerService', () => {
    let service: ZIndexManagerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ZIndexManagerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // Add more tests for your service methods here
});
