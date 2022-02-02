import { Directive, ElementRef, HostListener } from '@angular/core';

function isNumeric(value: string | number): boolean
{
   return ((value != null) &&
           (value !== '') &&
           !isNaN(Number(value.toString())));
}

@Directive({
  selector: '[dateFormatValidator]'
})
export class DateFormatValidatorDirective {

  constructor(private el: ElementRef) { }

  // @HostListener('input') onInput() {
  //   console.log(this.el.nativeElement.value);
  //   if (isNumeric(this.el.nativeElement.value)){
  //     alert("it is number !");
  //  }
  // }

  // @HostListener('keyup') onKeyup() {
  //   event.preventDefault();
  // }

}
