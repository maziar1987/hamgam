/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OrgunitService } from './orgunit.service';

describe('Service: Orgunit', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrgunitService]
    });
  });

  it('should ...', inject([OrgunitService], (service: OrgunitService) => {
    expect(service).toBeTruthy();
  }));
});
