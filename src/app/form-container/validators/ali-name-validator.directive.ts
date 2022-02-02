import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appAliName]',
  providers: [{ provide: NG_VALIDATORS, useExisting: AliNameValidatorDirective, multi: true }]
})
export class AliNameValidatorDirective implements Validator {

  constructor() { }

  validate(control: AbstractControl): ValidationErrors {
    return control.value == "علی" ? { aliNameValidator: { value: control.value } } : null;
  }

  // registerOnValidatorChange?(fn: () => void): void {
  //   // throw new Error('Method not implemented.');
  // }

}
