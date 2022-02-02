import { Component, forwardRef, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-timepicker-basic',
  templateUrl: './timepicker-basic.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimepickerBasicComponent),
      multi: true
    }
  ]
})
export class TimepickerBasicComponent implements ControlValueAccessor {

  @Output() timeChanged: EventEmitter<any> = new EventEmitter();

  time = null;
  spinners = false;
  isDisabled = false;

  constructor() { }

  // Function to call when the time changes.
  onChange = (_: any) => { };
  // Function to call when the input is touched (when a star is clicked).
  onTouched = () => { };

  onModelChange(newTime) {
    if (newTime) {
      var time: NgbTimeStruct = newTime;
      var res = time.hour.toString().padStart(2,'0') + ':' + time.minute.toString().padStart(2,'0') + ':' + time.second.toString().padStart(2,'0');
      this.onChange(res);
      this.timeChanged.emit(res);
    }
  }

  writeValue(obj: any): void {
    if (obj) {
      var res: string = obj;
      var arr = res.split(':');
      var time: NgbTimeStruct = { hour: +arr[0], minute: +arr[1], second: +arr[2] };
      this.time = time;
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
