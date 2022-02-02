import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, TreeNode } from 'primeng/api';
import { AccountService } from 'src/app/account/account.service';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { User } from 'src/app/user-management/models/user';
import { Activity } from '../models';
import { ActivityService } from '../services/activity.service';

@Component({
  selector: 'app-activity-history-list',
  templateUrl: './activity-history-list.component.html',
  styleUrls: ['./activity-history-list.component.scss']
})
export class ActivityHistoryListComponent extends BaseComponent implements OnInit {

  cols: any[];
  loading: boolean;
  activityHistories: Activity[] = [];
  currentUser: User;

  activityHistoriesNodes: TreeNode[] = [];
  selectedActivityHistoriesNode: TreeNode;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public activityService: ActivityService,
    private location: Location
  ) {
    super();
    this.setCols();
  }

  ngOnInit(): void {
    this.loadData();
  }

  getMenuItems(activity: Activity): MenuItem[] {
    var menuItems: MenuItem[] = [];

    this.translate.get('action').subscribe(trans => {
      menuItems.push(
        // { label: trans.view, icon: 'fa fa-search', command: () => { this.onView(activity); } },
        // { label: trans.delete, icon: 'fa fa-trash', command: () => { this.onDelete([activity]); } },
        // { label: trans.restore, icon: 'fa fa-trash-restore', command: () => { this.onRestore([activity]); } },
        // { label: trans.archive, icon: 'fa fa-archive', command: () => { this.onArchive([activity]); } },
        // { label: trans.history, icon: 'fa fa-history', command: () => { this.onHistory(activity); } }
      );
    });

    return menuItems;
  }

  setCols() {
    this.cols = this.activityService.cols;
  }

  loadData() {
    this.activatedRoute.paramMap.subscribe(p => {
      var id = +p.get('id');
      this.loading = true;
      this.activityService.getActivityHistory(id).subscribe(res => {
        this.loading = false;
        this.activityHistories = res;
        this.createTreeTableNodes(this.activityHistories, null);
      }, error => {
        this.loading = false;
        this.handleError(error);
      });
    });
  }

  createTreeTableNodes(activityHistories: Activity[], parent: TreeNode | null) {
    var children;
    if (parent) {
      children = activityHistories.filter(x => x.prevActivityId == parent.data.id);
      children.forEach(child => {
        var newNode = this.createTreeNode(child);
        parent.children.push(newNode);
        this.createTreeTableNodes(activityHistories, newNode);
      });
    } else {
      this.activityHistoriesNodes = [];
      children = activityHistories.filter(x => x.prevActivityId == null);
      children.forEach(child => {
        var newNode = this.createTreeNode(child);
        this.activityHistoriesNodes.push(newNode);
        this.createTreeTableNodes(activityHistories, newNode);
      });
    }
  }

  createTreeNode(activity: Activity) {
    return <TreeNode>{
      data: activity,
      children: []
      // leaf: false,
      // expanded: false
    }
  }

  onView(activity: Activity) {
    if (activity.activityObject?.objectType?.toLowerCase() == "expertperson") {
      this.activityService.setAsSeenActivity(activity.id).subscribe(res => { }, error => { console.error(error); });
      var taskId = activity.receivers[0].workflowTaskId;
      var workflowStep = activity.workflowStep;
      this.router.navigate(["experts", activity.activityObject.objectId, {
        aid: activity.id,
        wfTaskId: taskId,
        workflowStep: workflowStep
      }]);
    } else {
      this.router.navigate(["../../", activity.id], { relativeTo: this.activatedRoute });
    }
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

  back() {
    this.location.back();
  }

  handleError(error: any) {
    console.error(error);
  }

}
