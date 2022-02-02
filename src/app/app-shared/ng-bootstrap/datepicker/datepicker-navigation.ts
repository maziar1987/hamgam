import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ElementRef,
  ViewChild,
  Renderer2,
} from '@angular/core';
import { NavigationEvent, MonthViewModel } from './datepicker-view-model';
import { NgbDate } from './ngb-date';
import { NgbDatepickerI18n } from './datepicker-i18n';
import { toInteger } from '../util/util';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'jalali-moment';

@Component({
  selector: 'ngb-datepicker-navigation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./datepicker-navigation.scss'],
  templateUrl: './datepicker-navigation.html',
  // template: `
  //   <div class="ngb-dp-arrow">
  //     <button type="button" class="btn btn-link ngb-dp-arrow-btn" (click)="onClickPrev($event)" [disabled]="prevDisabled"
  //             i18n-aria-label="@@ngb.datepicker.previous-month" aria-label="Previous month"
  //             i18n-title="@@ngb.datepicker.previous-month" title="Previous month">
  //       <span class="ngb-dp-navigation-chevron"></span>
  //     </button>
  //   </div>
  //   <ngb-datepicker-navigation-select *ngIf="showSelect" class="ngb-dp-navigation-select"
  //     [date]="date"
  //     [disabled] = "disabled"
  //     [months]="selectBoxes.months"
  //     [years]="selectBoxes.years"
  //     (select)="select.emit($event)">
  //   </ngb-datepicker-navigation-select>

  //   <ng-template *ngIf="!showSelect" ngFor let-month [ngForOf]="months" let-i="index">
  //     <div class="ngb-dp-arrow" *ngIf="i > 0"></div>
  //     <div class="ngb-dp-month-name">
  //       {{ i18n.getMonthFullName(month.number, month.year) }} {{ i18n.getYearNumerals(month.year) }}
  //     </div>
  //     <div class="ngb-dp-arrow" *ngIf="i !== months.length - 1"></div>
  //   </ng-template>
  //   <div class="ngb-dp-arrow right">
  //     <button type="button" class="btn btn-link ngb-dp-arrow-btn" (click)="onClickNext($event)" [disabled]="nextDisabled"
  //             i18n-aria-label="@@ngb.datepicker.next-month" aria-label="Next month"
  //             i18n-title="@@ngb.datepicker.next-month" title="Next month">
  //       <span class="ngb-dp-navigation-chevron"></span>
  //     </button>
  //   </div>
  //   `
})
export class NgbDatepickerNavigation {
  navigation = NavigationEvent;

  @Input() date: NgbDate;
  @Input() disabled: boolean;
  @Input() months: MonthViewModel[] = [];
  @Input() showSelect: boolean;
  @Input() prevDisabled: boolean;
  @Input() nextDisabled: boolean;
  @Input() selectBoxes: { years: number[]; months: number[] };

  @Output() navigate = new EventEmitter<NavigationEvent>();
  @Output() select = new EventEmitter<NgbDate>();

  private _month = -1;
  private _year = -1;

  constructor(
    public i18n: NgbDatepickerI18n,
    private _renderer: Renderer2,
    private calendar: NgbCalendar
  ) {}

  @ViewChild('month', { static: true, read: ElementRef })
  monthSelect: ElementRef;
  @ViewChild('year', { static: true, read: ElementRef }) yearSelect: ElementRef;

  ngAfterViewChecked() {
    if (this.date) {
      if (this.date.month !== this._month) {
        this._month = this.date.month;
        this._renderer.setProperty(
          this.monthSelect.nativeElement,
          'value',
          this._month
        );
      }
      if (this.date.year !== this._year) {
        this._year = this.date.year;
        this._renderer.setProperty(
          this.yearSelect.nativeElement,
          'value',
          this._year
        );
      }
    }
  }

  onClickPrevMonth(event: MouseEvent) {
    (event.currentTarget as HTMLElement).focus();
    this.navigate.emit(this.navigation.PREV);
  }

  onClickNextMonth(event: MouseEvent) {
    (event.currentTarget as HTMLElement).focus();
    this.navigate.emit(this.navigation.NEXT);
  }
  onClickPrevYear(event: MouseEvent) {
    (event.currentTarget as HTMLElement).focus();
    if (toInteger(this.date.year) - 10 >= 1200) {
      this.select.emit(
        new NgbDate(
          toInteger(this.date.year) - 10,
          toInteger(this.date.month),
          1
        )
      );
    } else {
      this.select.emit(this.getToday());
    }
  }
  onClickNextYear(event: MouseEvent) {
    (event.currentTarget as HTMLElement).focus();
    if (toInteger(this.date.year) + 10 <= 1600) {
      this.select.emit(
        new NgbDate(
          toInteger(this.date.year) + 10,
          toInteger(this.date.month),
          1
        )
      );
    } else {
      this.select.emit(this.getToday());
    }
  }

  changeMonth(month: string) {
    this.select.emit(new NgbDate(this.date.year, toInteger(month), 1));
  }
  changeYear(year) {
    this.select.emit(new NgbDate(toInteger(year), this.date.month, 1));
  }

  getToday() {
    let convertedDate1 = moment(new Date()).locale('fa').format('YYYY/M/D');
    var convertedDateArr = convertedDate1.split('/');
    var ngbDateStruct: NgbDate = new NgbDate(
      +convertedDateArr[0],
      +convertedDateArr[1],
      +convertedDateArr[2]
    );

    return ngbDateStruct;
  }
}
