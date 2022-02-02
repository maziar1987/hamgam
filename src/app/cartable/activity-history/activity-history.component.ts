import { Component, OnInit } from '@angular/core';
import { TreeTableModule } from 'primeng/treetable';
import { TreeNode } from 'primeng/api';
import { ActivityHistory } from '../models/activity.model';
import { ActivityService } from '../services/activity.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Receiver, ReceiverCC } from 'src/app/user/user.model';
import { Location } from '@angular/common';
@Component({
  selector: 'app-activity-history',
  templateUrl: './activity-history.component.html',
  styleUrls: ['./activity-history.component.scss']
})
export class ActivityHistoryComponent implements OnInit {
  activitys: ActivityHistory[]
  cols: any[];
  activityId: string;
  treeNodes: TreeNode[];
  selectedNode: TreeNode;
  treeNodesChart: TreeNode[];
  selectedNodeChart: TreeNode;
  listActivt = false;
  constructor(
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private activityService: ActivityService) {
    this.cols = [
      { field: 'Id', header: 'Id' },
      { field: 'Sender', header: 'Sender' },
      { field: 'SendType', header: 'SendType' },
      { field: 'Receiver', header: 'Receiver' },
      { field: 'ReceiverCC', header: 'ReceiversCC' },
      { field: 'Date', header: 'Date' },
      { field: 'Text', header: 'Text' }
    ];
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(p => {
      this.activityId = p.get('id');
      this.loadData(p.get('id'));
    }, error => {
      this.handleError(error);
    });

  }

  loadData(id: string) {

    this.activityService.getActivityHistory(id).subscribe(res => {
      this.activitys = res;
      this.createTree(res);
    }, error => {
      this.handleError(error);
    });
  }

  getData(data: ActivityHistory) {
    return <ActivityHistory>{
      id: data.id, sender: data.sender,
      receivers: data.receivers,
      creationTime: data.creationTime, sendType: data.sendType, text: data.text
    }
  }
  handleError(error: any) {
    throw new Error("Method not implemented.");
  }
  view(id: number) {
    this.router.navigate(["cartable/activity/" + id]);
  }
  onNodeSelect(org) {
    if (org.node.data.sendType) {
      
    this.router.navigate(["cartable/activity/" + org.node.data.id]);

    } else {
      
    this.router.navigate(["cartable/activity/" + org.node.parent.data.id]);

    }
  }
  fitText(text: string): string {
    var s: string = text ? String(text).replace(/<[^>]+>/gm, '') : '';
    // if (s.length > 50) s = s.substr(0, 50) + " ...";
    return s;
  }
  showList() {
    this.listActivt = true;
  }
  showChart() {
    this.listActivt = false;
  }
  createTree(activityhistorys: ActivityHistory[], activityhistory: ActivityHistory = null, parentNode: TreeNode = null) {
    if (!parentNode) {
      this.treeNodes = [];
      this.treeNodesChart = [];
      var children = activityhistorys.filter(x => x.prevActivityId == null);
      children.forEach(activity => {
        var newNode = this.getNewTreeNode(activity);
        this.treeNodes = [...this.treeNodes, newNode];
        this.treeNodesChart = [...this.treeNodesChart, newNode];
        this.createTree(activityhistorys, activity, newNode);
      });
    } else {
      activityhistory.receivers.forEach(rec => {
        var newNode = this.getNewTreeNodeReceiver(rec, parentNode);
        parentNode.children = [...parentNode.children, newNode];
      });
      activityhistory.receiverCCs.forEach(rec => {
        var newNode = this.getNewTreeNodeReceiverCC(rec, parentNode);
        parentNode.children = [...parentNode.children, newNode];
      });
      activityhistory.receiverBCCs.forEach(rec => {
        var newNode = this.getNewTreeNodeReceiverBCC(rec, parentNode);
        parentNode.children = [...parentNode.children, newNode];
      });
      var children = activityhistorys.filter(x => x.prevActivityId == parentNode.data.id);
      children.forEach(activ => {
        var newNode = this.getNewTreeNode(activ, parentNode);
        var i = 0;
        parentNode.children.forEach(rec => {

          if (rec.data.receiverUser.id == activ.sender.user.id) {
            //element.children=[...element.children,newNode];
            if (rec.type == 'Receiver') {
              newNode.type = 'Receiver';
              newNode.label=rec.data.receiverUser.name + " " + rec.data.receiverUser.surname;
              
            }
            else if (rec.type == 'ReceiverCC') {
              newNode.type = 'ReceiverCC';
              newNode.label=rec.data.receiverUser.name + " " + rec.data.receiverUser.surname;
            }
            else if (rec.type == 'ReceiverBCC') {
              newNode.type = 'ReceiverBCC';
              newNode.label=rec.data.receiverUser.name + " " + rec.data.receiverUser.surname;
            }
            parentNode.children[i] = newNode;
            this.createTree(activityhistorys, activ, newNode);
          }
          i++;
        });
      });
    }
  }
  getNewTreeNode(activity: ActivityHistory, parentNode: TreeNode = null): TreeNode {
    return <TreeNode>{
      type: 'activity',
      label: activity.subject,
      data: activity,
      leaf: true,
      expanded: false,
      children: [],
      parent: parentNode
    };
  }
  getNewTreeNodeReceiver(res: Receiver, parentNode: TreeNode = null): TreeNode {
    return <TreeNode>{
      type: 'Receiver',
      label: res.user.firstName + " " + res.user.lastName,
      data: res,
      leaf: true,
      expanded: false,
      children: [],
      parent: parentNode
    };
  }
  getNewTreeNodeReceiverCC(res: ReceiverCC, parentNode: TreeNode = null): TreeNode {
    return <TreeNode>{
      type: 'ReceiverCC',
      label: res.user.firstName + " " + res.user.lastName,
      data: res,
      leaf: true,
      expanded: false,
      children: [],
      parent: parentNode
    };
  }
  getNewTreeNodeReceiverBCC(res: ReceiverCC, parentNode: TreeNode = null): TreeNode {
    return <TreeNode>{
      type: 'ReceiverBCC',
      label: res.user.firstName + " " + res.user.lastName,
      data: res,
      leaf: true,
      expanded: false,
      children: [],
      parent: parentNode
    };
  }
  clickBack() {
    this.location.back();
  }
}
