import { TestBed } from '@angular/core/testing';

import { PolicySetService } from './policy-set.service';

describe('PolicySetService', () => {
  let service: PolicySetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PolicySetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
