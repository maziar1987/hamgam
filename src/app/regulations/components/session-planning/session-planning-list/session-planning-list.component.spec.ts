import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionPlanningListComponent } from './session-planning-list.component';

describe('SessionPlanningListComponent', () => {
  let component: SessionPlanningListComponent;
  let fixture: ComponentFixture<SessionPlanningListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionPlanningListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionPlanningListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
