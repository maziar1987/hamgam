import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NajaExpertsSessionEnactmentsComponent } from './naja-experts-session-enactments.component';

describe('NajaExpertsSessionEnactmentsComponent', () => {
  let component: NajaExpertsSessionEnactmentsComponent;
  let fixture: ComponentFixture<NajaExpertsSessionEnactmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NajaExpertsSessionEnactmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NajaExpertsSessionEnactmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
