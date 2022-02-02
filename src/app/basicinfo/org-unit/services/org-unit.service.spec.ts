import { TestBed } from '@angular/core/testing';

import { OrgUnitService } from './org-unit.service';

describe('OrgUnitService', () => {
  let service: OrgUnitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrgUnitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
