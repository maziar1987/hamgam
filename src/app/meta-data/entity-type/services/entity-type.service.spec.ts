import { TestBed } from '@angular/core/testing';

import { EntityTypeService } from './entity-type.service';

describe('EntityTypeService', () => {
  let service: EntityTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntityTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
