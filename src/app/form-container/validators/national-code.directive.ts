import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[nationalCode]',
  providers: [{ provide: NG_VALIDATORS, useExisting: NationalCodeDirective, multi: true }]
})
export class NationalCodeDirective implements Validator {

  constructor() { }

  validate(control: AbstractControl): ValidationErrors {
    if (!control.value || control.value.length <= 0)
      return null;

    var nationalCode: string = control.value;

    if (/^(\d)(?!\1+$)\d{9}$/.test(nationalCode)) {
      var a = +nationalCode.charAt(9);
      var b = 0;
      for (let i = 0; i < 9; i++) {
        b += +nationalCode.charAt(i) * (10 - i);
      }
      b = b % 11;
      if ((b < 2 && a == b) || (b >= 2 && a == (11 - b)))
        return null;
    }

    return { nationalCode: { value: control.value } };
  }

  registerOnValidatorChange?(fn: () => void): void {

  }

}
