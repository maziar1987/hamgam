import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { Pagination } from 'src/app/app-shared/base/pagination.model';
import { BasicValue, BasicValueType } from 'src/app/basicinfo/basic-value/basic-value.model';
import { BasicValueService } from 'src/app/basicinfo/basic-value/basic-value.service';
import { User } from 'src/app/user-management/models/user';
import { UserManagementService } from 'src/app/user-management/services/user-management.service';
import { Activity, ActivitySend, Attachment, DefaultText, SendType } from '../models';
import { ActivityService } from '../services/activity.service';

@Component({
  selector: 'app-activity-create',
  templateUrl: './activity-create.component.html',
  styleUrls: ['./activity-create.component.scss']
})
export class ActivityCreateComponent extends BaseComponent implements OnInit {

  receiversItems: SelectItem[] = [];
  receiverCCsItems: SelectItem[] = [];
  receiverBCCsItems: SelectItem[] = [];
  attachmentsItems: SelectItem[] = [];

  priorities: BasicValue[] = [];
  classifications: BasicValue[] = [];

  toggledCC = false;
  loading = false;

  activity: Activity;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formbuilder: FormBuilder,
    private userManagementService: UserManagementService,
    private basicValueService: BasicValueService,
    private location: Location,
    private activityService: ActivityService) {
    super();
    this.filterCurrentUser();
  }

  ngOnInit(): void {
    this.loadUsersItems();
    this.loadBasicvalues();
    this.createForm();

    this.activatedRoute.url.subscribe(a => {
      var path = a[0].path;
      switch (path) {
        case 'forward':
          this.sendType.setValue(SendType[SendType.FORWARD]);
          break;
        case 'reply':
          this.sendType.setValue(SendType[SendType.REPLY]);
          break;
        case 'sendBack':
          this.sendType.setValue(SendType[SendType.SENDBACK]);
          break;
      }
    });

    this.activatedRoute.paramMap.subscribe(p => {
      var folderName = p.get('folderName');
      var activityId = +p.get('id');
      if (activityId) {
        this.getActivity(activityId);
      }
    });
  }

  get isReturn() { return this.sendType.value == SendType[SendType.REPLY] || this.sendType.value == SendType[SendType.SENDBACK]; }

  get attachmentsLength() { return this.attachments?.value?.length || 0; }

  get sendType() { return this.form.get('sendType'); }
  get text() { return this.form.get('text'); }
  get subject() { return this.form.get('subject'); }
  get receivers() { return this.form.get('receivers'); }
  get receiverCCs() { return this.form.get('receiverCCs'); }
  get receiverBCCs() { return this.form.get('receiverBCCs'); }
  get attachments() { return this.form.get('attachments'); }
  get priority() { return this.form.get('priority'); }
  get classification() { return this.form.get('classification'); }

  private createForm() {
    this.form = this.formbuilder.group({
      sendType: [SendType[SendType.COMPOSE], [Validators.required]],
      text: ['<p class="ql-align-right">به نام خدا</p>', Validators.required],
      subject: ['', Validators.required],
      receivers: [null, Validators.required],
      receiverCCs: [null],
      receiverBCCs: [null],
      attachments: [null],
      priority: [null, Validators.required],
      classification: [null, Validators.required]
    });
  }

  updateForm() {
    // this.sendType.setValue(this.activity.sendType);
    this.text.setValue(this.activity.text);
    this.subject.setValue(this.activity.subject);
    var rec = this.receiversItems.filter(x => this.activity.receivers.map(y => y.userId).includes(x.value.id)).map(x => x.value);
    this.receivers.setValue(rec);
    var recCC = this.receiverCCsItems.filter(x => this.activity.receiverCCs.map(y => y.userId).includes(x.value.id)).map(x => x.value);
    this.receiverCCs.setValue(recCC);
    var recBCC = this.receiverBCCsItems.filter(x => this.activity.receiverBCCs.map(y => y.userId).includes(x.value.id)).map(x => x.value);
    this.receiverBCCs.setValue(recBCC);
    this.attachments.setValue(this.activity.attachments);
    this.priority.setValue(this.priorities.find(x => x.id == this.activity.priority.id));
    this.classification.setValue(this.classifications.find(x => x.id == this.activity.classification.id));
  }

  toggleCC() {
    this.toggledCC = !this.toggledCC;
  }

  loadUsersItems() {
    this.userManagementService.getUsers(<Pagination>{ page: 0, size: 100000 }).subscribe(res => {
      var users: User[] = res.content;
      this.receiversItems = users.map(x => <SelectItem>{ label: `${x.firstName} ${x.lastName}`, value: x });
      this.receiverCCsItems = users.map(x => <SelectItem>{ label: `${x.firstName} ${x.lastName}`, value: x });
      this.receiverBCCsItems = users.map(x => <SelectItem>{ label: `${x.firstName} ${x.lastName}`, value: x });

      this.filterCurrentUser();

    }, error => {
      this.handleError(error);
    });
  }

  filterCurrentUser() {
    if (this.currentUser) {
      this.receiversItems = this.receiversItems.filter(x => x.value.id != this.currentUser.id);
      this.receiverCCsItems = this.receiverCCsItems.filter(x => x.value.id != this.currentUser.id);
      this.receiverBCCsItems = this.receiverBCCsItems.filter(x => x.value.id != this.currentUser.id);
    }
  }

  loadBasicvalues() {
    this.basicValueService.getBasicInfo(BasicValueType.classification).subscribe(res => {
      this.classifications = res.children;
    }, error => {
      console.error(error);
    });
    this.basicValueService.getBasicInfo(BasicValueType.priority).subscribe(res => {
      this.priorities = res.children;
    }, error => {
      console.error(error);
    });
  }

  getActivity(activityId: number) {
    this.activityService.getActivity(activityId).subscribe(activity => {
      this.activity = activity;
      this.updateForm();
    }, error => {
      console.error(error);
    });
  }

  defaultTextSelected(defaultText: DefaultText) {
    this.text.setValue(`${this.text.value}<p class='ql-align-right'>${defaultText.text}</p>`);
  }

  onUpload(event: any) {
    for (let file of event.target.files) {
      this.attachmentsItems = [...this.attachmentsItems,
      <SelectItem>{
        label: file.name,
        value: <Attachment>{
          objectType: 'File',
          name: file.name,
          file: file
        }
      }];
    }

    this.attachments.setValue(this.attachmentsItems.map(x => x.value));

    event.srcElement.value = null;
  }

  onRemoveUpload(attachment: SelectItem) {
    var index = this.attachmentsItems.indexOf(attachment);
    if (index > -1) {
      this.attachmentsItems.splice(index, 1);
      this.attachments.setValue(this.attachmentsItems.map(x => x.value));
    }
  }

  getFileName(attachment: SelectItem): string {
    return attachment.label.length <= 60 ? attachment.label : attachment.label.substring(0, 30) + ' ...';
  }

  showFile(event: any) {
    window.open(window.URL.createObjectURL(event.value.file), '_blank');
  }

  onSubmit() {
    if (this.form.invalid) {
      if (!this.text.value) {
        this.translate.get('activity.errorMessage.text').subscribe(trans =>
          this.warningNotify({ detail: trans, summary: 'اخطار' })
        );
        this.text.markAsTouched();
      }
      if (!this.subject.value) {
        this.translate.get('activity.errorMessage.subject').subscribe(trans =>
          this.warningNotify({ detail: trans, summary: 'اخطار' })
        );
        this.subject.markAsTouched();
      }
      if (!this.receivers.value) {
        this.translate.get('activity.errorMessage.receivers').subscribe(trans =>
          this.warningNotify({ detail: trans, summary: 'اخطار' })
        );
        this.receivers.markAsTouched();
      }
      if (!this.priority.value) {
        this.translate.get('activity.errorMessage.priority').subscribe(trans =>
          this.warningNotify({ detail: trans, summary: 'اخطار' })
        );
        this.priority.markAsTouched();
      }
      if (!this.classification.value) {
        this.translate.get('activity.errorMessage.classification').subscribe(trans =>
          this.warningNotify({ detail: trans, summary: 'اخطار' })
        );
        this.classification.markAsTouched();
      }

      return;
    }

    var activity: ActivitySend =
    {
      prevActivityId: this.activity?.id,

      sendType: this.sendType?.value,
      text: this.text?.value,
      subject: this.subject?.value,
      receivers: this.isReturn ? [this.activity?.sender?.userId] : this.receivers?.value?.map(x => x.id),
      receiverCCs: this.receiverCCs?.value?.map(x => x.id),
      receiverBCCs: this.receiverBCCs?.value?.map(x => x.id),
      attachments: this.attachments?.value,
      priorityId: this.priority?.value?.id,
      classificationId: this.classification?.value.id
    };

    this.loading = true;

    this.activityService.send(activity, activity.attachments?.map(x => x.file)).subscribe(res => {
      this.loading = false;
      this.translate.get('cartable.sendMessage.' + activity.sendType).subscribe(trans => {
        this.successNotify({ detail: trans, summary: 'عملیات موفق' });
      });
    }, error => {
      this.loading = false;
      console.error(error);
      this.translate.get('cartable.error.send').subscribe(res => {
        this.errorNotify({ detail: res, summary: 'رویداد خطا' });
      });
    }, () => {
      this.onBack();
    });
  }

  onBack() {
    this.location.back();
  }

  handleError(error: any) {
    console.error(error);
  }

}
