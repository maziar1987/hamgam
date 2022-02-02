import { TestBed } from '@angular/core/testing';

import { NajaExpertsSessionService } from './naja-experts-session.service';

describe('NajaExpertsSessionService', () => {
  let service: NajaExpertsSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NajaExpertsSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
