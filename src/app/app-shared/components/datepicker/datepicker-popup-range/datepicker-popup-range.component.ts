import { Component } from '@angular/core';
import { NgbCalendar, NgbDate } from 'src/app/app-shared/ng-bootstrap';

@Component({
  selector: 'app-datepicker-popup-range',
  templateUrl: './datepicker-popup-range.component.html',
  styleUrls: ['./datepicker-popup-range.component.scss']
})
export class DatepickerPopupRangeComponent {

  displayMonths = 2;
  navigation = 'select';
  showWeekNumbers = false;
  outsideDays = 'collapsed';
  autoClose = false;

  hoveredDate: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate;

  constructor(private calendar: NgbCalendar) { }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    }
    else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    }
    else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }

}
