import {Component, EventEmitter, forwardRef, Injectable, Input, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {NgbCalendar, NgbCalendarPersian, NgbDate, NgbDatepickerI18n, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'jalali-moment';
import {DatepickerPopupJalaliComponent} from '../../datepicker/datepicker-popup-jalali/datepicker-popup-jalali.component';
import {FieldType} from '@ngx-formly/core';

const WEEKDAYS_SHORT = ['د', 'س', 'چ', 'پ', 'ج', 'ش', 'ی'];
const MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];

@Injectable()
export class NgbDatepickerI18nPersian extends NgbDatepickerI18n {
  getWeekdayShortName(weekday: number) {
    return WEEKDAYS_SHORT[weekday - 1];
  }

  getMonthShortName(month: number) {
    return MONTHS[month - 1];
  }

  getMonthFullName(month: number) {
    return MONTHS[month - 1];
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.year}-${this.getMonthFullName(date.month)}-${date.day}`;
  }
}

@Component({
  selector: 'app-datepicker-jalali-formly',
  templateUrl: './datepicker-basic-jalali-formly.component.html',
  styleUrls: ['./datepicker-basic-jalali-formly.component.scss'],
  providers: [
    {provide: NgbCalendar, useClass: NgbCalendarPersian},
    {provide: NgbDatepickerI18n, useClass: NgbDatepickerI18nPersian},
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerPopupJalaliComponent),
      multi: true
    }
  ]
})
export class DatepickerBasicJalaliFormlyComponent extends FieldType implements ControlValueAccessor {

  @Output() dateSelect: EventEmitter<any> = new EventEmitter();
  @Input() plase: string = '';
  @Input() placement: string = 'bottom';
  @Input() readonly: string = null;
  isDisabled = false;
  date: NgbDateStruct;
  today = this.calendar.getToday();
  isWeekend = (date: NgbDate) => this.calendar.getWeekday(date) == 5;
  // Function to call when the date changes.
  onChange = (_: any) => {
  };
  // Function to call when the input is touched (when a star is clicked).
  onTouched = () => {
  };

  constructor(private calendar: NgbCalendar) {
    super();
  }

  onToday() {
    this.date = this.today;
    this.onDateSelect(new NgbDate(this.date.year, this.date.month, this.date.day));
  }

  onDateSelect(date: NgbDate) {
    if (date) {
      var convertedDate = moment.from(date.year + '/' + date.month + '/' + date.day, 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD');
      var convertedDateArr = convertedDate.split('/');
      var res: Date = new Date(Date.UTC(+convertedDateArr[0], +convertedDateArr[1] - 1, +convertedDateArr[2]));
      this.onChange(res);
      this.dateSelect.emit(res);
    } else {
      this.onChange(null);
      this.dateSelect.emit(null);
    }
  }

  valuechange(newDate: NgbDate) {
    this.date = newDate;
    this.onDateSelect(newDate);
  }

  writeValue(obj: any): void {
    if (obj) {
      let year: number;
      let month: number;
      let day: number;

      if (moment.isDate(obj)) {
        year = obj.getFullYear();
        month = obj.getMonth();
        day = obj.getDate();
      } else if (typeof obj == 'string') {
        year = +obj.split('T')[0].split('-')[0];
        month = +obj.split('T')[0].split('-')[1] - 1;
        day = +obj.split('T')[0].split('-')[2];
      }


      let convertedDate = moment(new Date(year, month, day)).locale('fa').format('YYYY/M/D');

      var convertedDateArr = convertedDate.split('/');
      var ngbDateStruct = {day: +convertedDateArr[2], month: +convertedDateArr[1], year: +convertedDateArr[0]};
      this.date = ngbDateStruct;
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
