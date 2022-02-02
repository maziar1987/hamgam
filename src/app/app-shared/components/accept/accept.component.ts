import { Component, EventEmitter, Output } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-accept',
  templateUrl: './accept.component.html',
  styleUrls: ['./accept.component.scss']
})
export class AcceptComponent {

  @Output() accept: EventEmitter<any> = new EventEmitter();

  constructor(private confirmationService: ConfirmationService) { }

  public show(message: string, acceptEventData?: any): void {

    this.confirmationService.confirm({
      message: message,
      header: 'حذف',
      icon: 'pi pi-info-circle',
      accept: () => { this.accept.emit(acceptEventData) },
      acceptLabel: "حذف",
      rejectLabel: "انصراف",
      acceptButtonStyleClass: "ui-button-raised ui-button-danger",
      rejectButtonStyleClass: "ui-button-raised ui-button-secondary"
    });
  }

}
