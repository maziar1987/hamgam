import { TestBed } from '@angular/core/testing';

import { WorkflowButtonGroupService } from './workflow-button-group.service';

describe('WorkflowButtonGroupService', () => {
  let service: WorkflowButtonGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkflowButtonGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
