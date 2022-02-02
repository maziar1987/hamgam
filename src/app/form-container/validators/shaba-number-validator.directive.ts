import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
    selector: '[shabaNumber]',
    providers: [{ provide: NG_VALIDATORS, useExisting: ShabaNumberValidatorDirective, multi: true }]
})
export class ShabaNumberValidatorDirective implements Validator {

    constructor() { }

    validate(control: AbstractControl): ValidationErrors {
        var isValid = /^(IR[0-9]{24})$/.test(control.value);
        return isValid ? null : { shabaNumber: { value: control.value, remainingLength: 26 - control.value.length } };
    }

    // registerOnValidatorChange?(fn: () => void): void {
    //   // throw new Error('Method not implemented.');
    // }

}
