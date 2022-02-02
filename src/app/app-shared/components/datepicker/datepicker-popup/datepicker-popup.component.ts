import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDateStruct } from 'src/app/app-shared/ng-bootstrap';

@Component({
  selector: 'app-datepicker-popup',
  templateUrl: './datepicker-popup.component.html',
  styleUrls: ['./datepicker-popup.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerPopupComponent),
      multi: true
    }
  ]
})
export class DatepickerPopupComponent implements ControlValueAccessor {

  isDisabled = false;
  date: NgbDateStruct;
  today = this.calendar.getToday();
  isWeekend = (date: NgbDate) => this.calendar.getWeekday(date) >= 6;
  // Function to call when the date changes.
  onChange = (_: any) => { };
  // Function to call when the input is touched (when a star is clicked).
  onTouched = () => { };

  constructor(private calendar: NgbCalendar) { }

  onDateSelect(date: NgbDate) {
    if (date) {
      var convertedDate: Date = new Date(Date.UTC(date.year, date.month - 1, date.day));
      this.onChange(convertedDate);
    } else {
      this.onChange(null);
    }
  }

  valuechange(newDate: NgbDate) {
    this.date = newDate;
    this.onDateSelect(newDate);
  }

  writeValue(obj: any): void {
    if (obj) {
      var input = new Date(obj);
      var ngbDateStruct = { day: input.getDate(), month: input.getUTCMonth() + 1, year: input.getUTCFullYear() };
      this.date = ngbDateStruct;
    }
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

}
