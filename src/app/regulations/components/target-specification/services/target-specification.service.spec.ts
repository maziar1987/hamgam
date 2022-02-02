import { TestBed } from '@angular/core/testing';

import { TargetSpecificationService } from './target-specification.service';

describe('TargetSpecificationService', () => {
  let service: TargetSpecificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TargetSpecificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
