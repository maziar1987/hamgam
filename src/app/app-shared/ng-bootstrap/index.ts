import {NgModule} from '@angular/core';


import {NgbDatepickerModule} from './datepicker/datepicker.module';

export {
  NgbCalendar,
  NgbCalendarGregorian,
  NgbCalendarHebrew,
  NgbCalendarIslamicCivil,
  NgbCalendarIslamicUmalqura,
  NgbCalendarPersian,
  NgbDate,
  NgbDateAdapter,
  NgbDateNativeAdapter,
  NgbDateNativeUTCAdapter,
  NgbDateParserFormatter,
  NgbDatepicker,
  NgbDatepickerConfig,
  NgbInputDatepickerConfig,
  NgbDatepickerContent,
  NgbDatepickerI18n,
  NgbDatepickerI18nHebrew,
  NgbDatepickerKeyboardService,
  NgbDatepickerModule,
  NgbDatepickerMonth,
  NgbDatepickerNavigateEvent,
  NgbDatepickerState,
  NgbDateStruct,
  NgbInputDatepicker,
  NgbPeriod
} from './datepicker/datepicker.module';


export {Placement} from './util/positioning';

//export {NgbConfig} from './ngb-config';


const NGB_MODULES = [
 NgbDatepickerModule

]
@NgModule({imports: NGB_MODULES, exports: NGB_MODULES})
export class NgbModule {
}
