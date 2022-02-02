import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api/menuitem';
import { DialogService } from 'primeng/dynamicdialog';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { Pagination } from 'src/app/app-shared/base/pagination.model';
import { SidebarMenuItem } from 'src/app/app-shared/components/sidebar/sidebar.model';
import { LoggerService } from 'src/app/app-shared/services/logger.service';
import { BasicValueService } from 'src/app/basicinfo/basic-value/basic-value.service';
import { User } from 'src/app/user/user.model';
import { FolderSelectComponent } from '../folder-select/folder-select.component';
import { ActivityBase, ActivityList, SendType } from '../models/activity.model';
import { ActivityArchive, ActivityMove, ActivityRestore, ActivityTrash, Folder } from '../models/folder.model';
import { ActivityService } from '../services/activity.service';
import { FolderService } from '../services/folder.service';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss']
})
export class ActivityListComponent extends BaseComponent implements OnInit {

  curentuser: User;

  loading: boolean;
  cols: any[];

  activities: ActivityList[];
  selectedActivities: ActivityList[];

  folderName: string;
  folderId: number;

  sendTypes = SendType;

  page: number = 0;
  rows: number = 10;
  first: number = 0;
  totalRecords: number = 0;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private logger: LoggerService,
    public activityService: ActivityService,
    private folderService: FolderService,
    private basicValueService: BasicValueService,
    private dialogService: DialogService
  ) {
    super();

    this.setCols();
  }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(user => {
      this.curentuser = user;
      this.userService.curUser = user;
    }, error => {
      console.error('getCurrentUser: ', error);
    });

    this.activatedRoute.paramMap.subscribe(p => {
      this.folderName = p.get('name');
      this.folderId = +p.get('id');

      this.loadData();
    }, error => {
      this.handleError(error);
    });
  }

  get pagination(): Pagination {
    return { page: this.page, size: this.rows, sort: ['lastName,asc', 'firstName,asc'] };
  }

  get currentPageReport(): any {
    return { value1: this.first, value2: this.rows, value3: this.totalRecords }
  }

  setCols() {
    this.cols = [
      { field: 'id', header: 'id' },
      { field: 'sender', header: 'sender' },
      { field: 'text', header: 'text' },
      { field: 'receiver', header: 'receiver' },
      { field: 'sendType', header: 'sendType' }
    ];
  }

  getMenuItems(activity: ActivityList): MenuItem[] {

    var cartable: any;
    this.translate.get('cartable').subscribe(res => {
      cartable = res;
    });

    var menuItems: MenuItem[] = [];

    menuItems.push({
      label: cartable.view, icon: 'fa fa-search', command: () => { this.view(activity); }
    });

    // if (this.userService.curUser?.id != activity.sender.userId) {
    //   menuItems.push(
    //     {
    //       label: cartable.forward, icon: 'fa fa-step-forward', command: () => { this.router.navigate(["cartable/forward/" + activity.id]); }
    //     },
    //     {
    //       label: cartable.reply, icon: 'fa fa-reply', command: () => { this.router.navigate(["cartable/reply/" + activity.id]); }
    //     },
    //     {
    //       label: cartable.return, icon: 'fa fa-undo', command: () => { this.router.navigate(["cartable/return/" + activity.id]); }
    //     }
    //   );
    // }

    menuItems.push({
      label: cartable.delete, icon: 'fa fa-trash', command: () => { this.trash([activity]); }
    });
    menuItems.push({
      label: cartable.referenceHistory, icon: 'fa fa-history', command: () => { this.router.navigate(["cartable/history/" + activity.chainIndex]); }
    });
    // menuItems.push({
    //   label: cartable.move, icon: 'fa fa-share-square-o', command: () => { this.moveActivityDialog([activity]) }
    // });

    return menuItems;
  }

  loadData() {
    if (this.folderId) {
      this.activityService.getActivities(this.folderId, this.pagination).subscribe(res => {
        this.activities = res.content.sort((a, b) => a.creationTime < b.creationTime ? 1 : -1);
        this.totalRecords = res.totalElements;
        this.setActivityBasicValues(this.activities);
        this.setActivityUsers(this.activities);
      }, error => {
        console.error("get activities error: ", error);
      });
    }
    else {
      this.getFolderId(this.folderName);
    }
  }

  getFolderId(name: string) {
    this.activityService.getFolder(name).subscribe(res => {
      this.folderId = res.id;
      this.loadData();
    }, error => {
      this.handleError(error);
    });
  }

  setActivityBasicValues(activities: ActivityBase[]) {
    activities.forEach(activity => {
      this.basicValueService.getBasicInfo(activity.priorityId).subscribe(res => activity.priority = res);
      this.basicValueService.getBasicInfo(activity.classificationId).subscribe(res => activity.classification = res);
    })
  }

  setActivityUsers(activities: ActivityBase[]) {
    activities.forEach(activity => {
      this.userService.getUser(activity.sender.userId).subscribe(user => {
        activity.sender.user = user;
      });

      activity.receivers?.forEach(receiver => {
        this.userService.getUser(receiver.userId).subscribe(res => receiver.user = res);
      })

      activity.receiverCCs?.forEach(receiver => {
        this.userService.getUser(receiver.userId).subscribe(res => receiver.user = res);
      })

      activity.receiverBCCs?.forEach(receiver => {
        this.userService.getUser(receiver.userId).subscribe(res => receiver.user = res);
      })

    })
  }

  view(activity: ActivityList) {
    if (activity.activityObject?.objectType.toLowerCase() == "expertperson") {
      var taskId = activity.receivers[0].wfTaskId;
      var activityType = activity.activityType;
      this.router.navigate(["experts/" + activity.activityObject.objectId, {
        aid: activity.id,
        wfTaskId: taskId,
        activityType: activityType
      }]);
    } else {

      this.router.navigate(["cartable/activity/" + activity.id]);
    }
  }

  newActivity() {
    this.router.navigate(["cartable/compose"]);
  }

  trash(items: ActivityList[]) {
    this.userService.getCurrentUser().subscribe(user => {
      var activityTrash: ActivityTrash =
      {
        ownerId: user.id,
        activitiesIds: items.map(x => x.id),
        fromFolderId: this.folderId
      };

      this.folderService.trashActivity(activityTrash).subscribe(res => {
        items.forEach(item => {
          var index: number = this.activities.indexOf(item);
          this.activities.splice(index, 1);
        });
        this.selectedActivities = [];
        // alert(items.length + " Item(s) deleteded.");
      });
    });
  }

  archive(items: ActivityList[]) {
    this.userService.getCurrentUser().subscribe(user => {
      var activityArchive: ActivityArchive =
      {
        ownerId: user.id,
        activitiesIds: items.map(x => x.id),
        fromFolderId: this.folderId
      };

      this.folderService.archiveActivity(activityArchive).subscribe(res => {
        items.forEach(item => {
          var index: number = this.activities.indexOf(item);
          this.activities.splice(index, 1);
        });
        this.selectedActivities = [];
        // alert(items.length + " Item(s) archived.");
      });
    });
  }

  restore(items: ActivityList[]) {
    this.userService.getCurrentUser().subscribe(user => {
      var activityRestore: ActivityRestore =
      {
        ownerId: user.id,
        activitiesIds: items.map(x => x.id),
        fromFolderId: this.folderId
      };

      this.folderService.restoreActivity(activityRestore).subscribe(res => {
        items.forEach(item => {
          var index: number = this.activities.indexOf(item);
          this.activities.splice(index, 1);
        });
        this.selectedActivities = [];
        // alert(items.length + " Item(s) restored.");
      });
    });
  }

  fitText(text: string): string {
    var s: string = text ? String(text).replace(/<[^>]+>/gm, ' ') : '';
    if (s.length > 100) s = s.substr(0, 100) + " ...";
    return s;
  }

  isButtonsDisabled(): boolean {
    return !(this.selectedActivities && this.selectedActivities.length > 0);
  }

  onSearch(event) {

  }

  IsItRead(activity: ActivityBase) {
    return this.activityService.IsItRead(activity);
  }

  transcriptType(activity: ActivityBase): string {
    if (activity.sender.userId == this.curentuser?.id) {
      return "";
    }

    var bcc = activity.receiverBCCs?.filter(receiver => receiver.userId = this.curentuser.id);
    if (bcc?.length > 0) {
      return "(رونوشت مخفی)";
    }

    var cc = activity.receiverCCs?.filter(receiver => receiver.userId === this.curentuser.id);
    if (cc?.length > 0) {
      return "(رونوشت)";
    }

    return "";
  }

  moveActivityDialog(activities: ActivityList[]) {
    const ref = this.dialogService.open(FolderSelectComponent, {
      header: 'انتخاب پوشه',
      width: '50vw',
      data: this.folderService.getCurrentFoldersTree()
    });
    ref.onClose.subscribe((result: { sidebarMenuItem: SidebarMenuItem, folder: Folder }) => {
      if (result) {
        this.moveActivities(activities.map(x => x.id), result.folder.id);
      }
    });
  }

  moveActivities(activitiesIds: number[], folderId: number) {
    if (activitiesIds && activitiesIds.length > 0 && folderId) {
      var activityMove: ActivityMove = { activitiesIds: activitiesIds, fromFolderId: this.folderId, toFolderId: folderId, ownerId: this.curentuser.id }
      this.folderService.moveActivity(activityMove).subscribe(r => {
        this.activities = this.activities.filter(x => activitiesIds.indexOf(x.id) < 0);
        this.successNotify({ detail: "جابجایی با موفقیت انجام شد", summary: "عملیات موفق" });
      }, error => {
        this.errorNotify({ detail: error, summary: 'رویداد خطا' });
        this.handleError(error);
      })
    } else {
      this.warningNotify({ detail: "پوشه موزد نظر را انتخاب کنید", summary: "اخطار" });
    }
  }

  handleError(error: any, id?: number) {
    if (error instanceof HttpErrorResponse) {
      this.logger.error(error);
    }
  }

  onPageChange(event) {
    //event.first = Index of the first record
    //event.rows = Number of rows to display in new page
    //event.page = Index of the new page
    //event.pageCount = Total number of pages
    this.page = event.page;
    this.rows = event.rows;
    this.loadData();
  }

  // setTotalRecords() {
  //   this.service.getPeopleCount().subscribe(count => {
  //     this.totalRecords = count;
  //   }, error => {
  //     console.error(error);
  //   });
  // }

  getReceivers(activity: ActivityList) {
    var res = [];
    activity.receivers.forEach(receiver => {
      res.push(`${receiver.user.firstName} ${receiver.user.lastName}`)
    });

    return res.join('، ');
  }
}
