import { Component, Input, OnInit } from '@angular/core';
import { ContainerButton } from '../models/container-button.model';

@Component({
  selector: 'app-form-container-toolbar',
  templateUrl: './form-container-toolbar.component.html',
  styleUrls: ['./form-container-toolbar.component.scss']
})
export class FormContainerToolbarComponent implements OnInit {

  @Input() buttons: ContainerButton[];

  constructor() { }

  ngOnInit(): void {
  }

}
