import { TestBed } from '@angular/core/testing';

import { DefaultTextService } from './default-text.service';

describe('DefaultTextService', () => {
  let service: DefaultTextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DefaultTextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
