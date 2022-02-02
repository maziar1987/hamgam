import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { Pagination } from 'src/app/app-shared/base/pagination.model';
import { BasicValue, BasicValueType } from 'src/app/basicinfo/basic-value/basic-value.model';
import { BasicValueService } from 'src/app/basicinfo/basic-value/basic-value.service';
import { UserExtended } from '../../user/user.model';
import { ActivitySend, ActivityView, ObjectReference, SendType } from '../models/activity.model';
import { DefaultText } from '../models/defaultText.model';
import { ActivityService } from '../services/activity.service';

@Component({
  selector: 'app-activity-create',
  templateUrl: './activity-create.component.html',
  styleUrls: ['./activity-create.component.scss'],
  providers: [DialogService]
})

export class ActivityCreateComponent extends BaseComponent implements OnInit {

  activity: ActivityView;
  sendType: SendType;

  users: UserExtended[];
  selectedUsers: UserExtended[] = [];

  usersCC: UserExtended[];
  selectedUsersCC: UserExtended[] = [];

  usersBCC: UserExtended[];
  selectedUsersBCC: UserExtended[] = [];

  subject: string = '';
  text: string = '<p class=\'ql-align-right\'>به نام خدا</p>';

  priorities: BasicValue[] = [];
  selectedPriority: BasicValue;

  classifications: BasicValue[] = [];
  selectedClassification: BasicValue;

  attachments: ObjectReference[] = [];
  selectedAttachment: ObjectReference;

  toggledCC = false;
  dateTime: Date;
  loading: boolean = false;

  sendActivity: boolean = false;
  files: any[] = [];
  // imy: mytest;
  // mmm = Blob;
  // myfile: File;
  fileUrl: any;
  url: any;
  filename: any;

  constructor(private sanitizer: DomSanitizer,
    private basicValueService: BasicValueService,
    private activatedRoute: ActivatedRoute,
    private activityService: ActivityService,
    private location: Location,
    public dialogService: DialogService) {
    super();
  }

  public base64ToBlob(b64Data, contentType = '', sliceSize = 512) {
    b64Data = b64Data.replace(/\s/g, ''); //IE compatibility...
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }


  convertBase64ToBlobData(base64Data: string, contentType: string = 'text/plain', sliceSize = 512) {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }


  ngOnInit() {
    this.activatedRoute.url.subscribe(a => {
      this.activatedRoute.paramMap.subscribe(p => {

        switch (a[0].path.toLowerCase()) {
          case 'compose':
            this.sendType = SendType.COMPOSE;
            break;
          case 'forward':
            this.sendType = SendType.FORWARD;
            break;
          case 'reply':
            this.sendType = SendType.REPLY;
            break;
          case 'return':
            this.sendType = SendType.SENDBACK;
            break;
          case 'send':
            this.sendActivity = true;
            break;
        }

        var activityId = +p.get('id');

        if (this.sendActivity == true) {
          this.sendType = this.activityService.activitySend.sendType;

          this.subject = this.activityService.activitySend.subject;
          this.text = this.activityService.activitySend.text;
          this.dateTime = this.activityService.activitySend.deadTime;

          this.attachments = this.activityService.activitySend.attachments;
        }

        if (activityId != 0) {
          this.getActivity(activityId);
        } else {
          this.setUsers();
          this.setBasicinfo();
        }

      });
    });

  }

  textSelect(event: DefaultText) {
    this.text += '<p class=\'ql-align-right\'><br></p><p class=\'ql-align-right\'>' + event.text + '</p>';
  }

  getActivity(activityId: number) {
    this.activityService.getActivity(activityId).subscribe(res => {

      this.activity = res;

      this.text = this.activity.text;
      this.subject = this.activity.subject;

      this.attachments = this.activity.attachments;

      this.setUsers();
      this.setBasicinfo();
    });
  }

  setUsers() {

    this.userService.getCurrentUser().subscribe(me => {
      this.userService.getAllUser(<Pagination>{ page: 0, size: 100000, sort: ['login,asc'] }).subscribe(res => {

        this.users = res.map(x => this.userService.extendUser(x))
          .filter(x => x.id != me.id);
        this.selectedUsers = [];

        this.usersCC = res.map(x => this.userService.extendUser(x))
          .filter(x => x.id != me.id);
        this.selectedUsersCC = [];

        this.usersBCC = res.map(x => this.userService.extendUser(x))
          .filter(x => x.id != me.id);
        this.selectedUsersBCC = [];

        if (this.sendType == SendType.REPLY || this.sendType == SendType.SENDBACK) {
          var user = this.userService.extendUser(this.activity.sender.user);
          this.users = [user];
          this.selectedUsers = [user];
        } else if (this.sendActivity) {
          this.selectedUsers = this.users.filter(x => this.activityService.activitySend.receivers.includes(x.id));
          this.selectedUsersCC = this.users.filter(x => this.activityService.activitySend.receiverCCs.includes(x.id));
          this.selectedUsersBCC = this.users.filter(x => this.activityService.activitySend.receiverBCCs.includes(x.id));
        }

      }, error => this.handleError(error));
    });
  }

  setBasicinfo() {
    this.basicValueService.getBasicInfo(BasicValueType.classification).subscribe(res => {
      this.classifications = res.children;

      if (this.sendActivity) {
        this.selectedClassification = this.classifications.find(x => this.activityService.activitySend.classificationId == x.id);
      }
    }, error => {
      console.error(error);
    });
    this.basicValueService.getBasicInfo(BasicValueType.priority).subscribe(res => {
      this.priorities = res.children;

      if (this.sendActivity) {
        this.selectedPriority = this.priorities.find(x => this.activityService.activitySend.priorityId == x.id);
      }
    }, error => {
      console.error(error);
    });
  }

  handleError(error: any) {
    throw new Error('Method not implemented.');
  }

  sendButton() {

    if (this.selectedClassification == null) {
      this.infoNotify({ detail: 'نوع محرمانگی انتخاب نشده است.', summary: 'اطلاعات' });
      return;
    }

    if (this.selectedPriority == null) {
      this.infoNotify({ detail: 'نوع فوریت انتخاب نشده است.', summary: 'اطلاعات' });
      return;
    }

    if (this.text == '' || this.subject == '') {
      this.translate.get('cartable.requiredText').subscribe(res => {
        this.infoNotify({ detail: res, summary: 'اطلاعات' });
      });
      return;
    }

    var activity: ActivitySend =
    {
      prevActivityId: this.activity ? this.activity.id : null,
      sendType: this.sendType,

      text: this.text,
      subject: this.subject,
      deadTime: this.dateTime,

      receivers: this.selectedUsers.map(x => x.id),
      receiverCCs: this.selectedUsersCC.map(x => x.id),
      receiverBCCs: this.selectedUsersBCC.map(x => x.id),

      attachments: this.attachments,

      priorityId: this.selectedPriority?.id,
      classificationId: this.selectedClassification?.id
    };

    this.loading = true;

    this.activityService.send(activity).subscribe(
      res => {
        this.clickBack();
        this.loading = false;
        this.translate.get('cartable.sendMessage.' + activity.sendType).subscribe(trans => {
          this.successNotify({ detail: trans, summary: 'عملیات موفق' });
        });
      },
      error => {
        console.log(error);
        this.translate.get('cartable.error.send').subscribe(res => {
          this.errorNotify({ detail: res, summary: 'رویداد خطا' });
        });
        this.loading = false;
      }
    );

  }

  onUpload(event) {
    for (let file of event.target.files) {

      var newObject: ObjectReference =
      {
        objectType: 'File',
        name: file.name,
        object: file
      };

      this.attachments.push(newObject);
    }
  }

  onRemove(rowData: ObjectReference) {
    var index: number;

    index = this.attachments.indexOf(rowData);
    if (index > -1) {
      this.attachments.splice(index, 1);
    }
  }

  clickBack() {
    this.location.back();
  }

  showFile(rowData: ObjectReference) {
    if (rowData.id) {
      // var url: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.activityService.apiUrl + "/cartable/uploadfiles/" + rowData.physicalName);
      window.open(this.activityService.apiUrl + '/cartable/uploadfiles/' + rowData.guid, '_blank');
    } else {
      window.open(window.URL.createObjectURL(rowData.object), '_blank');
    }
  }

  getFileName(attachment: ObjectReference) {
    return attachment.name.length <= 30 ? attachment.name : attachment.name.substring(0, 30) + '.....';
  }

  toggleCC() {
    this.toggledCC = !this.toggledCC;
  }

}

