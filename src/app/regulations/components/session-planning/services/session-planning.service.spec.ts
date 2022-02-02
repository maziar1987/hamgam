import { TestBed } from '@angular/core/testing';

import { SessionPlanningService } from './session-planning.service';

describe('SessionPlanningService', () => {
  let service: SessionPlanningService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionPlanningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
