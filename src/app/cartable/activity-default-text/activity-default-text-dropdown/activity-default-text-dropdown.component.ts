import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { DefaultText } from '../../models/defaultText.model';
import { DefaultTextService } from '../../services/defaultText.service';
import { ActivityDefaultTextCreateComponent } from '../activity-default-text-create/activity-default-text-create.component';
import { ActivityDefaultTextDeleteComponent } from '../activity-default-text-delete/activity-default-text-delete.component';

@Component({
  selector: 'app-activity-default-text-dropdown',
  templateUrl: './activity-default-text-dropdown.component.html',
  styleUrls: ['./activity-default-text-dropdown.component.scss']
})
export class ActivityDefaultTextDropdownComponent extends BaseComponent implements OnInit, OnDestroy {

  selectedDefaultText: DefaultText;
  defaultTexts: DefaultText[] = [];

  ref: DynamicDialogRef;

  @Output() text: EventEmitter<DefaultText> = new EventEmitter();

  constructor(
    private defaultTextService: DefaultTextService,
    public dialogService: DialogService,
  ) { super(); }

  ngOnInit(): void {
    this.defaultTextService.getAll().subscribe(res => {
      this.defaultTexts = res;
    })
  }
  onChangeValue() {
    this.text.emit(this.selectedDefaultText);
  }
  create() {
    this.ref = this.dialogService.open(ActivityDefaultTextCreateComponent, {
      header: 'افزودن متن پیش فرض',
      width: '50%'
    });

    this.ref.onClose.subscribe((text: string) => {
      if (text) {

        var newTemplate: DefaultText = { text: text };

        this.defaultTextService.insert(newTemplate).subscribe(res => {
          newTemplate.id = res.id;
          this.defaultTexts = [...this.defaultTexts, newTemplate];
          this.successNotify({ detail: 'متن انتخابی افزوده شد', summary: "عملیات موفق" });
        });

      }
    });

  }

  delete() {
    if (this.selectedDefaultText) {
      this.ref = this.dialogService.open(ActivityDefaultTextDeleteComponent, {
        data: {
          id: this.selectedDefaultText.id
        },
        header: 'حذف متن پیش فرض',
        width: '50%'
      });

      this.ref.onClose.subscribe((id: number) => {
        if (id) {
          this.defaultTexts = this.defaultTexts.filter(x => x.id != id);
          this.successNotify({ detail: 'متن انتخابی حذف شد', summary: "عملیات موفق" });
        }
      });

    }
    else {
      this.warningNotify({ detail: 'متن را انتخاب کنید', summary: "اخطار" });
    }

  }

  ngOnDestroy(): void {
    if (this.ref)
      this.ref.close();
  }
}
