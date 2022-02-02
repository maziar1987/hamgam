import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NajaExpertsSessionMembersComponent } from './naja-experts-session-members.component';

describe('NajaExpertsSessionMembersComponent', () => {
  let component: NajaExpertsSessionMembersComponent;
  let fixture: ComponentFixture<NajaExpertsSessionMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NajaExpertsSessionMembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NajaExpertsSessionMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
