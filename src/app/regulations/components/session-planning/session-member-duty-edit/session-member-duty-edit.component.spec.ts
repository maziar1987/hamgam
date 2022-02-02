import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionMemberDutyEditComponent } from './session-member-duty-edit.component';

describe('SessionMemberDutyEditComponent', () => {
  let component: SessionMemberDutyEditComponent;
  let fixture: ComponentFixture<SessionMemberDutyEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionMemberDutyEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionMemberDutyEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
