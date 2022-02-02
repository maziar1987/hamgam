import { Component, EventEmitter, forwardRef, Injectable, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment from 'jalali-moment';
import { NgbCalendar, NgbCalendarPersian, NgbDate, NgbDatepickerI18n, NgbDateStruct } from 'src/app/app-shared/ng-bootstrap';

const WEEKDAYS_SHORT = ['د', 'س', 'چ', 'پ', 'ج', 'ش', 'ی'];
const MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];

export interface DateRange {
  fromDate: Date;
  toDate: Date;
}

@Injectable()
export class NgbDatepickerI18nPersian extends NgbDatepickerI18n {
  getWeekdayShortName(weekday: number) { return WEEKDAYS_SHORT[weekday - 1]; }
  getMonthShortName(month: number) { return MONTHS[month - 1]; }
  getMonthFullName(month: number) { return MONTHS[month - 1]; }
  getDayAriaLabel(date: NgbDateStruct): string { return `${date.year}-${this.getMonthFullName(date.month)}-${date.day}`; }
}

@Component({
  selector: 'app-datepicker-range-jalali',
  templateUrl: './datepicker-range-jalali.component.html',
  styleUrls: ['./datepicker-range-jalali.component.scss'],
  providers: [
    { provide: NgbCalendar, useClass: NgbCalendarPersian },
    { provide: NgbDatepickerI18n, useClass: NgbDatepickerI18nPersian },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerRangeJalaliComponent),
      multi: true
    }
  ]
})
export class DatepickerRangeJalaliComponent implements ControlValueAccessor {

  @Output() dateSelect: EventEmitter<any> = new EventEmitter();

  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate;
  toDate: NgbDate | null = null;

  isDisabled = false;
  isWeekend = (date: NgbDate) => this.calendar.getWeekday(date) == 5;
  // Function to call when the date changes.
  onChange = (_: any) => { };
  // Function to call when the input is touched (when a star is clicked).
  onTouched = () => { };

  constructor(private calendar: NgbCalendar) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && (date.after(this.fromDate) || date.equals(this.fromDate))) {
      this.toDate = date;

      var fromDate: Date;
      if (this.fromDate) {
        var fromDateConverted = moment.from(this.fromDate.year + '/' + this.fromDate.month + '/' + this.fromDate.day, 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD');
        var convertedDateArr = fromDateConverted.split('/');
        fromDate = new Date(Date.UTC(+convertedDateArr[0], +convertedDateArr[1] - 1, +convertedDateArr[2]));
      }

      var toDate: Date
      if (this.toDate) {
        var toDateConverted = moment.from(this.toDate.year + '/' + this.toDate.month + '/' + this.toDate.day, 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD');
        convertedDateArr = toDateConverted.split('/');
        toDate = new Date(Date.UTC(+convertedDateArr[0], +convertedDateArr[1] - 1, +convertedDateArr[2]));
      }

      this.onChange(<DateRange>{ fromDate: fromDate, toDate: toDate });
      this.dateSelect.emit(<DateRange>{ fromDate: fromDate, toDate: toDate });
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  writeValue(obj: any): void {
    if (obj) {
      var range = obj as DateRange;
      let year = range.fromDate.getFullYear();
      let month = range.fromDate.getMonth();
      let day = range.fromDate.getDate();

      let convertedDate = moment(new Date(year, month, day)).locale('fa').format('YYYY/M/D');

      var convertedDateArr = convertedDate.split('/');
      var ngbDate = <NgbDate>{ day: +convertedDateArr[2], month: +convertedDateArr[1], year: +convertedDateArr[0] };
      this.fromDate = ngbDate;

      year = range.toDate.getFullYear();
      month = range.toDate.getMonth();
      day = range.toDate.getDate();

      convertedDate = moment(new Date(year, month, day)).locale('fa').format('YYYY/M/D');

      convertedDateArr = convertedDate.split('/');
      ngbDate = <NgbDate>{ day: +convertedDateArr[2], month: +convertedDateArr[1], year: +convertedDateArr[0] };
      this.toDate = ngbDate;

    } else {
      this.fromDate = null;
      this.toDate = null;
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
