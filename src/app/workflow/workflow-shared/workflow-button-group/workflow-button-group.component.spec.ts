import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowButtonGroupComponent } from './workflow-button-group.component';

describe('WorkflowButtonGroupComponent', () => {
  let component: WorkflowButtonGroupComponent;
  let fixture: ComponentFixture<WorkflowButtonGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowButtonGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowButtonGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
