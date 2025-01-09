import { TestBed } from '@angular/core/testing';

import { PurchasingService } from './purchasing.service';

describe('PurchasingService', () => {
  let service: PurchasingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchasingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
