import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NajaExpertsSessionComponent } from './naja-experts-session.component';

describe('NajaExpertsSessionComponent', () => {
  let component: NajaExpertsSessionComponent;
  let fixture: ComponentFixture<NajaExpertsSessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NajaExpertsSessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NajaExpertsSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
