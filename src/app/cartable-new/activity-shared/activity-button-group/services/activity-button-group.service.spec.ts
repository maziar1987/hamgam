import { TestBed } from '@angular/core/testing';

import { ActivityButtonGroupService } from './activity-button-group.service';

describe('ActivityButtonGroupService', () => {
  let service: ActivityButtonGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivityButtonGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
