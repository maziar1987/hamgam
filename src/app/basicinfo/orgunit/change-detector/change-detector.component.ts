import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-change-detector',
  templateUrl: './change-detector.component.html',
  //styleUrls: ['./change-detector.components.scss']
})
export class ChangeDetectorComponent implements OnChanges {

  @Input() variable: any;
  @Output() onChange = new EventEmitter();
first:boolean=true;
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    //if (changes.variable.previousValue !== changes.variable.currentValue)
    if(this.first==true){
      this.first=false;
      return;
    }
      this.onChange.emit();
  }

}
