import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatepickerBasicJalaliFormlyComponent } from './datepicker-basic-jalali-formly.component';

describe('DatepickerBasicJalaliComponent', () => {
  let component: DatepickerBasicJalaliFormlyComponent;
  let fixture: ComponentFixture<DatepickerBasicJalaliFormlyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatepickerBasicJalaliFormlyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatepickerBasicJalaliFormlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
