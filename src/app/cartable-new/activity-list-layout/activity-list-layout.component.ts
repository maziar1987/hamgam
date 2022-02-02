import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { Pagination } from 'src/app/app-shared/base/pagination.model';
import { StorageService } from 'src/app/app-shared/services/storage.service';
import { Activity } from '../models';
import { ActivityFolderType } from '../models/activity-folder-type.enum';
import { ActivityService } from '../services/activity.service';

@Component({
  selector: 'app-activity-list-layout',
  templateUrl: './activity-list-layout.component.html',
  styleUrls: ['./activity-list-layout.component.scss']
})
export class ActivityListLayoutComponent extends BaseComponent implements OnInit {

  isCardView = false;
  activities: Activity[];
  loading = false;
  pageLoading = false;

  page: number = 0;
  rows: number = 10;
  first: number = 0;
  totalRecords: number = 0;

  folderName: string;
  folderId: number;

  activityFolderType: ActivityFolderType;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private activityService: ActivityService,
    private storageService: StorageService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.isCardView = this.storageService.getItem("isCardView");

    this.activatedRoute.paramMap.subscribe(p => {
      this.folderName = this.activatedRoute.snapshot.url[0].path;
      this.activityFolderType = ActivityFolderType[this.folderName];
      this.pageLoading = true;
      this.loadData();
    }, error => {
      this.handleError(error);
    });
  }

  get pagination(): Pagination { return { page: this.page, size: this.rows }; }
  get currentPageReport(): any { return { value1: this.first, value2: this.rows, value3: this.totalRecords }; }

  loadData() {
    this.loading = true;
    this.activityService.getActivitiesByFolderName(this.folderName, this.pagination).subscribe(activities => {
      this.loading = false;
      this.pageLoading = false;
      activities.content.sort((a, b) => a.creationTime < b.creationTime ? 1 : -1);
      this.activities = activities.content;
      this.totalRecords = activities.totalElements;
    }, error => {
      this.loading = false;
      this.pageLoading = false;
      this.handleError(error);
    });
  }

  handleError(error: any) {
    console.error('activity list layout error: ', error);
  }

  viewActivity(activity: Activity) {
    this.activityService.setAsSeenActivity(activity.id).subscribe(res => { }, error => { console.error(error); });
    const taskId = activity.receivers[0].workflowTaskId;
    const workflowStep = activity.workflowStep;
    const params = {
      aid: activity.id,
      wfTaskId: taskId,
      workflowStep: workflowStep,
      senderUserId: activity.sender?.userId
    };
    this.router.navigate([activity.routerLink, activity.activityObject.objectId, params]);
    // if (activity.workflowName?.toLowerCase() == "expertperson") {
    //   this.activityService.setAsSeenActivity(activity.id).subscribe(res => { }, error => { console.error(error); });
    //   taskId = activity.receivers[0].workflowTaskId;
    //   workflowStep = activity.workflowStep;
    //   var params = {
    //     aid: activity.id,
    //     wfTaskId: taskId,
    //     workflowStep: workflowStep,
    //     senderUserId: activity.sender?.userId
    //   };
    //   if (activity.workflowStep.toLowerCase() == ExpertPersonWorkflowStep[ExpertPersonWorkflowStep.check]) {
    //     this.router.navigate(["experts", activity.activityObject.objectId, params]);
    //   } else if (activity.workflowStep.toLowerCase() == ExpertPersonWorkflowStep[ExpertPersonWorkflowStep.edit]) {
    //     this.router.navigate(["experts", "edit", activity.activityObject.objectId, params]);
    //   }
    // } else if (activity.activityObject.objectType === "Certificate") {
    //   this.activityService.setAsSeenActivity(activity.id).subscribe(res => { }, error => { console.error(error); });
    //   taskId = activity.receivers[0].workflowTaskId;
    //   workflowStep = activity.workflowStep;
    //   this.router.navigate(["regulations/add-edit/certificate", activity.activityObject.objectId, {
    //     aid: activity.id,
    //     wfTaskId: taskId,
    //     workflowStep: workflowStep
    //   }]);
    // } else {
    //   this.router.navigate(["activity", activity.id], { relativeTo: this.activatedRoute });
    // }
  }

  createActivity() {
    this.router.navigate(["activity", "compose"], { relativeTo: this.activatedRoute });
  }

  deleteActivities(activities: Activity[]) {
    this.activityService.deleteActivities(activities.map(x => x.id)).subscribe(res => {
      this.activities = this.activities.filter(x => !activities.map(z => z.id).includes(x.id));
      this.translate.get('message.delete.successful.successMessage').subscribe(trans =>
        this.successNotify({ detail: trans, summary: "عملیات موفق" })
      );
    }, error => {
      console.error(error);
      this.errorNotify()
    });
  }

  restoreActivities(activities: Activity[]) {
    this.activityService.restoreActivities(activities.map(x => x.id)).subscribe(res => {
      this.activities = this.activities.filter(x => !activities.map(z => z.id).includes(x.id));
      this.translate.get('message.restore.successful', { value: '' }).subscribe(trans =>
        this.successNotify({ detail: trans, summary: "عملیات موفق" })
      );
    }, error => {
      console.error(error);
      this.errorNotify()

    });
  }

  archiveActivities(activities: Activity[]) {
    this.activityService.archiveActivities(activities.map(x => x.id)).subscribe(res => {
      this.activities = this.activities.filter(x => !activities.map(z => z.id).includes(x.id));
      this.translate.get('message.archive.successful', { value: '' }).subscribe(trans =>
        this.successNotify({ detail: trans, summary: "عملیات موفق" })
      );
    }, error => {
      console.error(error);
      this.errorNotify()
    });
  }

  forward(activity: Activity) {
    console.log('forward');
    this.router.navigate(["activity", "forward", activity.id], { relativeTo: this.activatedRoute });
  }

  reply(activity: Activity) {
    console.log('reply');
    this.router.navigate(["activity", "reply", activity.id], { relativeTo: this.activatedRoute });
  }

  sendBack(activity: Activity) {
    console.log('sendback');
    this.router.navigate(["activity", "sendBack", activity.id], { relativeTo: this.activatedRoute });
  }

  activityHistory(activity: Activity) {
    this.router.navigate(["activity", "history", activity.id], { relativeTo: this.activatedRoute });
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

  toggleCardView() {
    this.isCardView = !this.isCardView;
    this.storageService.setItem("isCardView", this.isCardView);
  }

}
