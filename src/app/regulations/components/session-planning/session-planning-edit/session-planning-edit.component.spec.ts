import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionPlanningEditComponent } from './session-planning-edit.component';

describe('SessionPlanningEditComponent', () => {
  let component: SessionPlanningEditComponent;
  let fixture: ComponentFixture<SessionPlanningEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionPlanningEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionPlanningEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
