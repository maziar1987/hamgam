import { Component, EventEmitter, forwardRef, Injectable, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment from 'jalali-moment';
import { NgbCalendar, NgbCalendarPersian, NgbDate, NgbDatepicker, NgbDatepickerI18n, NgbDateStruct } from 'src/app/app-shared/ng-bootstrap';

const WEEKDAYS_SHORT = ['د', 'س', 'چ', 'پ', 'ج', 'ش', 'ی'];
const MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];

@Injectable()
export class NgbDatepickerI18nPersian extends NgbDatepickerI18n {
  getWeekdayShortName(weekday: number) { return WEEKDAYS_SHORT[weekday - 1]; }
  getMonthShortName(month: number) { return MONTHS[month - 1]; }
  getMonthFullName(month: number) { return MONTHS[month - 1]; }
  getDayAriaLabel(date: NgbDateStruct): string { return `${date.year}-${this.getMonthFullName(date.month)}-${date.day}`; }
}

@Component({
  selector: 'app-datepicker-basic-jalali',
  templateUrl: './datepicker-basic-jalali.component.html',
  styleUrls: ['./datepicker-basic-jalali.component.scss'],
  providers: [
    { provide: NgbCalendar, useClass: NgbCalendarPersian },
    { provide: NgbDatepickerI18n, useClass: NgbDatepickerI18nPersian },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerBasicJalaliComponent),
      multi: true
    }
  ]
})
export class DatepickerBasicJalaliComponent implements ControlValueAccessor {

  @ViewChild('dp') dp: NgbDatepicker;
  @Output() dateSelect: EventEmitter<any> = new EventEmitter();

  isDisabled = false;
  date: NgbDate;
  today = this.calendar.getToday();
  isWeekend = (date: NgbDate) => this.calendar.getWeekday(date) == 5;
  // Function to call when the date changes.
  onChange = (_: any) => { };
  // Function to call when the input is touched (when a star is clicked).
  onTouched = () => { };

  constructor(private calendar: NgbCalendar) { }

  selectToday() {
    this.date = this.calendar.getToday();
    this.onDateSelect(new NgbDate(this.date.year, this.date.month, this.date.day));
    this.dp.navigateTo({ year: this.date.year, month: this.date.month, day: this.date.day })
  }

  onDateSelect(date: NgbDate) {
    if (date) {
      var convertedDate = moment.from(date.year + '/' + date.month + '/' + date.day, 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD');
      var convertedDateArr = convertedDate.split('/');
      var res: Date = new Date(Date.UTC(+convertedDateArr[0], +convertedDateArr[1] - 1, +convertedDateArr[2]));
      this.dateSelect.emit(res);
      this.onChange(res);
    } else {
      this.dateSelect.emit(null);
      this.onChange(null);
    }
  }

  valuechange(newDate: NgbDate) {
    this.date = newDate;
    this.onDateSelect(newDate);
  }

  writeValue(obj: any): void {
    if (obj) {
      let year = obj.getFullYear();
      let month = obj.getMonth();
      let day = obj.getDate();

      let convertedDate = moment(new Date(year, month, day)).locale('fa').format('YYYY/M/D');

      var convertedDateArr = convertedDate.split('/');
      var ngbDateStruct = <NgbDate>{ day: +convertedDateArr[2], month: +convertedDateArr[1], year: +convertedDateArr[0] };
      this.date = ngbDateStruct;
      this.dp?.navigateTo({ year: this.date?.year, month: this.date?.month, day: this.date?.day })
    } else {
      this.date = null;
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
