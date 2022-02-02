import { Component, Input } from '@angular/core';
import { ContainerButton } from '../models/container-button.model';

@Component({
  selector: 'app-form-container-button-group',
  templateUrl: './form-container-button-group.component.html'
})
export class FormContainerButtonGroupComponent {

  @Input() buttons: ContainerButton[];

}
