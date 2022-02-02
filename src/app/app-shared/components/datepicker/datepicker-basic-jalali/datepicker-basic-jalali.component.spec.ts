import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatepickerBasicJalaliComponent } from './datepicker-basic-jalali.component';

describe('DatepickerBasicJalaliComponent', () => {
  let component: DatepickerBasicJalaliComponent;
  let fixture: ComponentFixture<DatepickerBasicJalaliComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatepickerBasicJalaliComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatepickerBasicJalaliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
