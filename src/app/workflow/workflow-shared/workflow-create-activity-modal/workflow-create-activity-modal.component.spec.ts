import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowCreateActivityModalComponent } from './workflow-create-activity-modal.component';

describe('WorkflowCreateActivityModalComponent', () => {
  let component: WorkflowCreateActivityModalComponent;
  let fixture: ComponentFixture<WorkflowCreateActivityModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowCreateActivityModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowCreateActivityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
