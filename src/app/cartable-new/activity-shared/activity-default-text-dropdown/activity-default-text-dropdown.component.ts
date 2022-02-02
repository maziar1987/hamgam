import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { DefaultText } from '../../models';
import { DefaultTextService } from '../../services/default-text.service';

@Component({
  selector: 'app-activity-default-text-dropdown',
  templateUrl: './activity-default-text-dropdown.component.html',
  styleUrls: ['./activity-default-text-dropdown.component.scss']
})
export class ActivityDefaultTextDropdownComponent extends BaseComponent implements OnInit {

  @Output() textSelected: EventEmitter<DefaultText> = new EventEmitter();

  selectedDefaultText: DefaultText | null = null;
  defaultTexts: DefaultText[] = [];

  displayCreate = false;
  text: string;

  constructor(
    private defaultTextService: DefaultTextService,
    private confirmationService: ConfirmationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.defaultTextService.getDefaultTexts().subscribe(res => {
      this.defaultTexts = res;
    })
  }

  onChangeValue() {
    this.textSelected.emit(this.selectedDefaultText);
  }

  showCreate() {
    this.displayCreate = true;
  }

  deleteConfirmation() {
    var action: any;
    this.translate.get('action').subscribe(trans => {
      action = trans;
    });

    this.confirmationService.confirm({
      message: `حذف "${this.selectedDefaultText?.text}" انجام شود؟`,
      header: action.delete,
      icon: 'pi pi-info-circle',
      accept: () => {
        this.delete();
      },
      acceptLabel: action.delete,
      rejectLabel: action.cancel,
      acceptButtonStyleClass: "ui-button-danger",
      rejectButtonStyleClass: "ui-button-secondary"
    });
  }

  create() {
    if (this.text) {
      var newTemplate: DefaultText = { text: this.text };

      this.defaultTextService.createDefaultText(newTemplate).subscribe(res => {
        this.displayCreate = false;
        newTemplate.id = res.id;
        this.defaultTexts = [...this.defaultTexts, newTemplate];
        this.successNotify({ detail: 'متن انتخابی افزوده شد', summary: "عملیات موفق" });
      }, error => {
        console.error(error);
        this.errorNotify();
      });

    }
  }

  delete() {
    if (this.selectedDefaultText) {
      this.defaultTextService.deleteDefaultText(this.selectedDefaultText.id).subscribe(res => {
        this.defaultTexts = this.defaultTexts.filter(x => x.id != this.selectedDefaultText.id);
        this.successNotify({ detail: 'متن انتخابی حذف شد', summary: "عملیات موفق" });
      }, error => {
        console.error(error);
        this.errorNotify()
      });
    }
    else {
      this.warningNotify({ detail: 'متن را انتخاب کنید', summary: "اخطار" });
    }

  }

}
