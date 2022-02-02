import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatepickerRangeJalaliComponent } from './datepicker-range-jalali.component';

describe('DatepickerRangeJalaliComponent', () => {
  let component: DatepickerRangeJalaliComponent;
  let fixture: ComponentFixture<DatepickerRangeJalaliComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatepickerRangeJalaliComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatepickerRangeJalaliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
