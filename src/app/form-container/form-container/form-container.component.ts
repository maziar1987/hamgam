import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Activity } from 'src/app/cartable-new/models';
import { ContainerButton } from '../models/container-button.model';
import { FormContainerChildBaseComponent } from '../models/form-container-child-base-component';
import { ChildType } from '../models/form-container.model';

@Component({
  selector: 'app-form-container',
  templateUrl: './form-container.component.html',
  styleUrls: ['./form-container.component.scss']
})
export class FormContainerComponent extends FormContainerChildBaseComponent implements OnInit {

  actionTranslate: any;
  private _location: Location;
  createActivityDisplay: boolean = false;
  createActivityAction: string | null = null;

  constructor(
    private location: Location,
  ) {
    super();

    this._location = location;
  }

  ngOnInit(): void {
    this.translate.get('action').subscribe(res => {
      this.actionTranslate = res;
    });
  }

  get buttonGroup(): ContainerButton[] {
    if (!this.formContainerService.currentChild) {
      return <ContainerButton[]>[];
    }

    var containerButtons = <ContainerButton[]>[];

    if (this.formContainerService.currentChild.childType != ChildType.list) {
      containerButtons.push({
        label: this.actionTranslate.back,
        onClick: ({ event }: { event: any }): void => {
          typeof this.formContainerService.currentChild.component.onBack == 'function' ?
            this.formContainerService.currentChild.component.onBack() :
            this.onBack();
        },
        cssClass: "ui-button-raised ui-button-secondary float-left mr-2 col-sm-1",
        order: 5
      });

      if (this.formContainerService.currentChild.isProcessStarter) {
        var sendLabel = '';
        if (this.formContainerService.currentChild.childType == ChildType.create) {
          sendLabel = `${this.actionTranslate.create}، `;
        }
        if (this.formContainerService.currentChild.childType == ChildType.edit) {
          sendLabel = `${this.actionTranslate.saveChanges}، `;
        }
        sendLabel += this.actionTranslate.send;
        containerButtons.push({
          label: sendLabel,
          onClick: ({ event }: { event: any }): void => {
            this.showCreateActivity("onCreateOrEditAndSend");
          },
          iconClass: "fa fa-paper-plane",
          cssClass: "ui-button-raised ui-button-primary col-sm-2 mr-2",
          order: 2,
          disabled: this.formContainerService.currentChild.formGroup.invalid
        });
      }
    }

    if (this.formContainerService.currentChild.childType == ChildType.create) {
      containerButtons.push({
        label: this.actionTranslate.create,
        onClick: ({ event }: { event: any }): void => {
          typeof this.formContainerService.currentChild.component.onSubmit == 'function' ?
            this.formContainerService.currentChild.component.onSubmit() :
            this.onSubmit();
        },
        cssClass: "ui-button-success float-left",
        iconClass: "pi pi-plus",
        order: 8,
        disabled: this.formContainerService.currentChild.formGroup.invalid
      });
    }

    if (this.formContainerService.currentChild.childType == ChildType.edit) {
      if (!this.formContainerService.currentChild.unEditable) {
        containerButtons.push({
          label: this.actionTranslate.saveChanges,
          onClick: ({ event }: { event: any }): void => {
            typeof this.formContainerService.currentChild.component.onSubmit == 'function' ?
              this.formContainerService.currentChild.component.onEdit() :
              this.onEdit();
          },
          cssClass: "ui-button-success float-left",
          iconClass: "pi pi-check",
          order: 7,
          disabled: this.formContainerService.currentChild.formGroup.invalid
        });
      }
    }

    if (this.formContainerService.currentChild.childType == ChildType.detail) {
      if (!this.formContainerService.currentChild.isProcessCompleter &&
        !this.formContainerService.currentChild.unEditable) {
        containerButtons.push({
          label: this.actionTranslate.delete,
          onClick: ({ event }: { event: any }): void => {
            typeof this.formContainerService.currentChild.component.onDelete == 'function' ?
              this.formContainerService.currentChild.component.onDelete() :
              this.onDelete();
          },
          cssClass: "ui-button-danger float-left",
          iconClass: "pi pi-trash",
          order: 6,
          disabled: this.formContainerService.currentChild.formGroup.invalid
        });
      }
    }
    if (this.formContainerService.currentChild.isProcessCompleter) {
      containerButtons.push({
        label: this.actionTranslate.confirm,
        onClick: ({ event }: { event: any }): void => {
          this.showCreateActivity("onConfirm");
        },
        cssClass: "ui-button-success",
        iconClass: "pi pi-check",
        order: 3,
        disabled: this.formContainerService.currentChild.formGroup.invalid ||
          this.formContainerService.currentChild.unEditable
      }, {
        label: this.actionTranslate.unConfirm,
        onClick: ({ event }: { event: any }): void => {
          this.showCreateActivity("onUnConfirm");
        },
        cssClass: "ui-button-danger mr-2",
        iconClass: "pi pi-times",
        order: 4,
        disabled: this.formContainerService.currentChild.formGroup.invalid ||
          this.formContainerService.currentChild.unEditable
      }, {
        label: this.actionTranslate.return,
        onClick: ({ event }: { event: any }): void => {
          this.showCreateActivity("onReturn");
        },
        cssClass: "ui-button-primary mr-2",
        iconClass: "pi pi-check",
        order: 5,
        disabled: this.formContainerService.currentChild.formGroup.invalid ||
          this.formContainerService.currentChild.unEditable
      });
    }

    return containerButtons.sort((a, b) => a.order - b.order);
  }

  get toolbarButtons(): ContainerButton[] {
    return <ContainerButton[]>[];
  }

  onSubmit() {
    if (this.formContainerService.currentChild.formGroup.invalid) {
      return;
    }

    this.formContainerService.post(this.formContainerService.currentChild).subscribe(res => {
      this.successNotify();
      this.onBack();
    }, error => {
      console.error('form container insert error: ', error);
      if (error.error?.nationalcode === 'duplicate') {
        this.errorNotify({ detail: 'امکان ثبت وجود ندارد! فرد خبره تکراری می باشد.', summary: 'رخداد خطا' });
      } else if (error.error?.expertworkinggroup === 'duplicate') {
        this.errorNotify({ detail: 'عنوان کارگروه تکرای می باشد.', summary: 'رخداد خطا' });
      } else {
        this.errorNotify();
      }
    });
  }

  onEdit() {
    if (this.formContainerService.currentChild.formGroup.invalid) {
      return;
    }

    this.formContainerService.put(this.formContainerService.currentChild).subscribe(res => {
      this.successNotify({ detail: 'عملیات ویرایش با موفقیت انجام شد', summary: 'عملیات موفق' });
      this.onBack();
    }, error => {
      this.errorNotify()
      console.error('form container update error: ', error);
    });
  }

  onDelete() {
    this.formContainerService.delete(this.formContainerService.currentChild).subscribe(res => {
      this.successNotify({ detail: 'عملیات حذف با موفقیت انجام شد ', summary: 'عملیات موفق' });
      this.onBack();
    }, error => {
      this.errorNotify()
      console.error('form container delete error: ', error);
    });
  }

  onBack() {
    this._location.back();
  }

  onCreateOrEditAndSend(activity: Activity) {
    if (this.formContainerService.currentChild.formGroup.invalid) {
      return;
    }

    if (this.formContainerService.currentChild.childType == ChildType.create) {
      this.formContainerService.post(this.formContainerService.currentChild).subscribe(res => {
        this.successNotify({ detail: 'عملیات ثبت با موفقیت انجام شد', summary: 'عملیات موفق' });
        this.formContainerService.currentChild.component.onSend(activity, res);
        this.onBack();
      }, error => {
        console.error('form container insert error: ', error);
        if (error.error?.nationalcode == 'duplicate') {
          this.errorNotify({ detail: 'امکان ثبت وجود ندارد! فرد خبره تکراری می باشد.', summary: 'رخداد خطا' });
        } else {
          this.errorNotify();
        }
      });
    } else if (this.formContainerService.currentChild.childType == ChildType.edit) {
      this.formContainerService.put(this.formContainerService.currentChild).subscribe(res => {
        this.successNotify({ detail: 'عملیات ویرایش با موفقیت انجام شد', summary: 'عملیات موفق' });
        this.formContainerService.currentChild.component.onSend(activity, res);
        this.onBack();
      }, error => {
        console.error('form container edit and send error: ', error);
        this.successNotify();
      });
    }
  }

  showCreateActivity(createActivityAction: string) {
    if (this.formContainerService.currentChild.formGroup.invalid) {
      return;
    }

    this.createActivityDisplay = true;
    this.createActivityAction = createActivityAction;
  }

  createActivitySubmit(event: { action: string, activity: Activity }) {
    if (event.action == "onConfirm") {
      this.formContainerService.currentChild.component.onConfirm(event.activity);
    } else if (event.action == "onUnConfirm") {
      this.formContainerService.currentChild.component.onUnConfirm(event.activity);
    } else if (event.action == "onReturn") {
      this.formContainerService.currentChild.component.onReturn(event.activity);
    } else if (event.action == "onCreateOrEditAndSend") {
      this.onCreateOrEditAndSend(event.activity);
    }
  }

}
