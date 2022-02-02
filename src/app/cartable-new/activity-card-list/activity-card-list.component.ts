import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AccountService } from 'src/app/account/account.service';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { User } from 'src/app/user-management/models/user';
import { Activity, SendType } from '../models';
import { ActivityFolderType } from '../models/activity-folder-type.enum';
import { ActivityService } from '../services/activity.service';

@Component({
  selector: 'app-activity-card-list',
  templateUrl: './activity-card-list.component.html',
  styleUrls: ['./activity-card-list.component.scss']
})
export class ActivityCardListComponent extends BaseComponent implements OnInit {

  @Input() activityFolderType: ActivityFolderType | null = null;
  @Input() activities: Activity[];
  @Input() currentPageReport: any;
  @Input() loading: boolean;

  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() view: EventEmitter<Activity> = new EventEmitter();
  @Output() delete: EventEmitter<Activity[]> = new EventEmitter();
  @Output() restore: EventEmitter<Activity[]> = new EventEmitter();
  @Output() archive: EventEmitter<Activity[]> = new EventEmitter();
  @Output() history: EventEmitter<Activity> = new EventEmitter();
  @Output() forward: EventEmitter<Activity> = new EventEmitter();
  @Output() reply: EventEmitter<Activity> = new EventEmitter();
  @Output() sendBack: EventEmitter<Activity> = new EventEmitter();

  sendTypes = SendType;
  currentUser: User;

  constructor(
    public activityService: ActivityService
  ) {
    super();
  }

  ngOnInit(): void {
    this.accountService.currentAccount$.subscribe(account => {
      this.currentUser = account;
    });
  }

  get isTrash() { return this.activityFolderType == ActivityFolderType.trash; }
  get isArchive() { return this.activityFolderType == ActivityFolderType.archive; }

  getMenuItems(activity: Activity): MenuItem[] {
    var menuItems: MenuItem[] = [];

    this.translate.get('action').subscribe(trans => {
      menuItems.push({ label: trans.view, icon: 'fa fa-eye', command: () => { this.onView(activity); } });

      if (this.isTrash || this.isArchive) {
        menuItems.push({ label: trans.restore, icon: 'fa fa-trash-restore', command: () => { this.onRestore(activity); } });
      }
      if (!this.isArchive) {
        menuItems.push({ label: trans.archive, icon: 'fa fa-archive', command: () => { this.onArchive(activity); } });
      }

      if (!this.isTrash) {
        menuItems.push({ label: trans.delete, icon: 'fa fa-trash', command: () => { this.onDelete(activity); } });
      }

      menuItems.push(
        { separator: true },
        { label: trans.history, icon: 'fa fa-history', command: () => { this.onHistory(activity); } }
      );
    });

    this.translate.get('activity.sendType').subscribe(trans => {
      if (this.activityService.isNotSender(activity, this.currentUser)) {
        menuItems.push(
          { separator: true },
          { label: trans.FORWARD, icon: 'fa fa-step-forward', command: () => { this.onForward(activity); } },
          { label: trans.REPLY, icon: 'fa fa-reply', command: () => { this.onReply(activity); } },
          { label: trans.SENDBACK, icon: 'fa fa-step-backward', command: () => { this.onSendBack(activity); } });
      }
    });

    return menuItems;
  }

  onSearch(event) {

  }

  onView(activity: Activity) {
    this.view.emit(activity);
  }

  onCreate() {
    this.create.emit();
  }

  onDelete(activity: Activity) {
    this.delete.emit([activity]);
  }

  onRestore(activity: Activity) {
    this.restore.emit([activity]);
  }

  onArchive(activity: Activity) {
    this.archive.emit([activity]);
  }

  onForward(activity: Activity) {
    this.forward.emit(activity);
  }

  onReply(activity: Activity) {
    this.reply.emit(activity);
  }

  onSendBack(activity: Activity) {
    this.sendBack.emit(activity);
  }

  onHistory(activity: Activity) {
    this.history.emit(activity);
  }

  unseen(activity: Activity): boolean {
    if (activity.sender.userId == this.currentUser.id) {
      return false;
    }
    var receiver = activity.receivers.find(x => x.userId == this.currentUser.id);
    if (receiver?.seenTime) {
      return false;
    }
    var cc = activity.receiverCCs.find(x => x.userId == this.currentUser.id);
    if (cc?.seenTime) {
      return false;
    }
    var bcc = activity.receiverBCCs.find(x => x.userId == this.currentUser.id);
    if (bcc?.seenTime) {
      return false;
    }
    return true;
  }

}
