import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-spinner-border',
  templateUrl: './spinner-border.component.html',
  styleUrls: ['./spinner-border.component.scss']
})
export class SpinnerBorderComponent implements OnInit {

  @Input() loading: boolean = false;  

  constructor() { }

  ngOnInit(): void {
  }

}
