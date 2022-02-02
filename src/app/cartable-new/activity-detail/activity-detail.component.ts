import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { AppFileManagerService } from 'src/app/app-file-manager/app-file-manager.service';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { User } from 'src/app/user-management/models/user';
import { Activity, Attachment } from '../models';
import { ActivityFolderType } from '../models/activity-folder-type.enum';
import { ActivityService } from '../services/activity.service';

@Component({
  selector: 'app-activity-detail',
  templateUrl: './activity-detail.component.html',
  styleUrls: ['./activity-detail.component.scss']
})
export class ActivityDetailComponent extends BaseComponent implements OnInit {

  @ViewChild('activityText', { static: true }) activityText: ElementRef;

  activityFolderType: ActivityFolderType | null = null;
  activity: Activity;
  currentUser: User;
  sendTypeCC: string;
  attachmentsUrls: string[] = [];
  loading: boolean = false;
  body = "body";

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public activityService: ActivityService,
    private location: Location,
    private appFileManagerService: AppFileManagerService
  ) {
    super();
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(p => {
      var id = +p.get('id');

      var folderName = this.router.url.split('/')[2];
      this.activityFolderType = ActivityFolderType[folderName];

      this.loading = true;
      this.activityService.getActivity(id).subscribe(res => {
        this.loading = false;
        this.activity = res;
        this.activityText.nativeElement.innerHTML = this.activity?.text;
        this.setSendTypeCC();
      }, error => {
        this.loading = false;
        this.handleError(error);
      });
    });
  }

  get isTrash() { return this.activityFolderType == ActivityFolderType.trash; }
  get isArchive() { return this.activityFolderType == ActivityFolderType.archive; }

  get menuItems(): MenuItem[] {
    var menuItems: MenuItem[] = [];
    this.translate.get('activity.sendType').subscribe(trans => {
      if (this.activityService.isNotSender(this.activity, this.currentUser)) {
        menuItems.push(
          { label: trans.FORWARD, icon: 'fa fa-step-forward', command: () => { this.forward(); } },
          { label: trans.REPLY, icon: 'fa fa-reply', command: () => { this.reply(); } },
          { label: trans.SENDBACK, icon: 'fa fa-step-backward', command: () => { this.sendBack(); } },
          { separator: true });
      }
    });
    this.translate.get('action').subscribe(trans => {
      menuItems.push({ label: trans.history, icon: 'fa fa-history', command: () => { this.onHistory(); } });
    });

    return menuItems;
  }

  getGttachmentName(attachment: Attachment): string {
    return attachment.name.length > 12 ?
      `${attachment.name.substring(0, 15)} ...` :
      attachment.name;
  }

  getAttachmentFileIcon(attachment: Attachment) {
    var extention = attachment.name.split('.').pop();
    switch (extention.toLowerCase()) {
      case 'pdf':
        return 'fa fa-file-pdf text-danger';
      case 'ppt':
      case 'pptx':
        return 'fa fa-file-powerpoint text-orange';
      case 'xls':
      case 'xlsx':
        return 'fa fa-file-excel text-success';
      case 'doc':
      case 'docx':
        return 'fa fa-file-word text-primary';
      case 'jpg':
      case 'png':
      case 'gif':
        return "fa fa-file-image text-info";
      default:
        return "fa fa-file";
    }
  }

  setSendTypeCC() {
    var receiverCCs = this.activity?.receiverCCs?.filter(a => a.user?.id == this.currentUser.id);
    if (receiverCCs?.length > 0) {
      this.translate.get('activity.receiverCCs').subscribe(trans => {
        this.sendTypeCC = trans;
      });
    } else {
      var receiverBCCs = this.activity?.receiverBCCs?.filter(a => a.user?.id == this.currentUser.id);
      if (receiverBCCs?.length > 0) {
        this.translate.get('activity.receiverBCCs').subscribe(trans => {
          this.sendTypeCC = trans;
        });
      }
    }

  }

  back() {
    this.location.back();
  }

  forward() {
    console.log('forward');
    this.router.navigate(["../", "forward", this.activity.id], { relativeTo: this.activatedRoute });
  }

  reply() {
    console.log('reply');
    this.router.navigate(["../", "reply", this.activity.id], { relativeTo: this.activatedRoute });
  }

  sendBack() {
    console.log('sendback');
    this.router.navigate(["../", "sendBack", this.activity.id], { relativeTo: this.activatedRoute });
  }

  showAttachment(attachment: Attachment) {
    if (!attachment.file) {
      this.activityService.getActivityFile(attachment.objectId).subscribe(async (appFile) => {
        appFile.dataContentType = appFile.contentType;
        attachment.appFile = appFile;
        attachment.file = `data:${appFile.contentType};base64,` + appFile.data;
        attachment.file = await this.appFileManagerService.convertToFile(attachment.file, attachment.appFile);

        this.appFileManagerService.openFile(attachment.file, attachment.appFile);
      }, error => {
        console.error(error);
      })
    } else {
      this.appFileManagerService.openFile(attachment.file, attachment.appFile);
    }
  }

  onDelete() {
    this.activityService.deleteActivities([this.activity.id]).subscribe(res => {
      this.translate.get('message.delete.successful.successMessage').subscribe(trans =>
        this.successNotify({ detail: trans, summary: "عملیات موفق" })
      );
      this.back();
    }, error => {
      console.error(error);
      this.errorNotify();
    });
  }

  onRestore() {
    this.activityService.restoreActivities([this.activity.id]).subscribe(res => {
      this.translate.get('message.restore.successful', { value: '' }).subscribe(trans =>
        this.successNotify({ detail: trans, summary: "عملیات موفق" })
      );
      this.back();
    }, error => {
      console.error(error);
      this.errorNotify();
    });
  }

  onArchive() {
    this.activityService.archiveActivities([this.activity.id]).subscribe(res => {
      this.translate.get('message.archive.successful', { value: '' }).subscribe(trans =>
        this.successNotify({ detail: trans, summary: "عملیات موفق" })
      );
      this.back();
    }, error => {
      console.error(error);
      this.errorNotify();
    });
  }

  onHistory() {
    this.router.navigate(["../", "history", this.activity.id], { relativeTo: this.activatedRoute });
  }

  handleError(error: any) {
    console.error(error);
  }

}
