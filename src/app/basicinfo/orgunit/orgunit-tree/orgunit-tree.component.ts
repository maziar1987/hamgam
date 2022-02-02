import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem,TreeNode } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { AcceptComponent } from 'src/app/app-shared/components/accept/accept.component';
import { LoggerService } from 'src/app/app-shared/services/logger.service';
import { OrgunitCreate } from '../orgunit.model';
import { OrgunitService } from '../orgunit.service';
@Component({
  selector: 'app-orgunit-tree',
  templateUrl: './orgunit-tree.component.html',
  styleUrls: ['./orgunit-tree.component.scss']
})
export class OrgunitTreeComponent extends BaseComponent implements OnInit, OnDestroy {
  ref: DynamicDialogRef;
  treeNodes: TreeNode[];
  orgUnits: OrgunitCreate[];
  selectedNode: TreeNode;
  loading: boolean;
  temp: TreeNode[];

  sclicktimeout: any = null;
  @ViewChild('accept_modal') accept_modal: AcceptComponent;
  // orgUnitId:string;
  @Output() orgUnitIdout = new EventEmitter<string>();
  @Output() dblorgUnitId = new EventEmitter<string>();
  constructor(
    private loggerService: LoggerService,
    public dialogService: DialogService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private orgunitservice: OrgunitService,
  ) {
    super();
  }


  ngOnInit() {

    this.loading = true;
    this.loadData();
  }

  get items(): MenuItem[] {
    var res = [

      { label: 'افزودن زیر مجموعه', icon: 'pi pi-plus', command: (event) => this.createNewNode(this.selectedNode) }
    ];

    if (this.selectedNode?.data.parentId) {
      res.push(
        { label: 'مشاهده', icon: 'pi pi-info', command: (event) => this.viewNode(this.selectedNode) },
        { label: 'ویرایش', icon: 'pi pi-pencil', command: (event) => this.editNode(this.selectedNode) },
        { label: 'حذف', icon: 'pi pi-trash', command: (event) => this.showdialog(this.selectedNode) });
    }
    return res;
  }
  deleteNode(selectedNode: TreeNode): void {
    this.orgunitservice.deleteorg(selectedNode.data.id).subscribe(res => {
      //this.loadData();
      selectedNode.parent.children = selectedNode.parent.children.filter(a => a.data.id != selectedNode.data.id);
      // this.notifySuccess('حذف انجام شد', "عملیات موفق")
     // this.messageService.add({ key: 'tl', severity: 'success', summary: "عملیات موفق", detail: 'حذف انجام شد' });
    }, error => {
      this.handleError(error);
    });
  }
  editNode(selectedNode: TreeNode): void {
    this.selectedNode = selectedNode;
    this.orgunitservice.selectedNode = selectedNode;
    this.router.navigate(["./", "edit", this.selectedNode.data.id], { relativeTo: this.activatedRoute });
  }
  createNewNode(selectedNode: TreeNode): void {
    this.selectedNode = selectedNode;
    this.orgunitservice.selectedNode = selectedNode;
    this.router.navigate(["./", "create", this.selectedNode.data.id], { relativeTo: this.activatedRoute });
  }
  loadData(): void {
    this.orgunitservice.getOrgUnit(1).subscribe(res => {
      this.orgUnits = [];
      this.orgUnits.push(res);
      this.treeNodes = this.createtree(this.orgUnits);
    }, error => {
      this.handleError(error);
    });
  }

  nodeExpand(event) {
    if (event.node) {
      this.orgunitservice.getChildOrgUnits(event.node.data.id).subscribe(res => {
        this.orgUnits = res;
        event.node.children = this.createtree(this.orgUnits, event.node);
      }, error => {
        this.handleError(error);
      });
    }
  }
  createtree(orgunit: OrgunitCreate[], parent?: TreeNode): TreeNode[] {
    this.temp = [];
    orgunit.forEach(element => {
      this.temp.push(<TreeNode>{ label: element.displayName, data: element, leaf: false, parent: parent });
    });
    return this.temp;
  }

  handleError(error: any) {
    window.alert("error");
  }

  unselectFile(): void {
    this.selectedNode = null;
    this.loggerService.log('unselected');

  }

  viewNode(selectedNode: TreeNode): void {
    this.selectedNode = selectedNode;
    this.router.navigate(["./", "detail", selectedNode.data.id], { relativeTo: this.activatedRoute });
  }

  nodeSelect(event) {
    clearTimeout(this.sclicktimeout);
    this.sclicktimeout = setTimeout(() => {

      this.selectedNode = event.node;
      this.orgUnitIdout.emit(event.node.data.id);
    }, 400);

    // this.router.navigate(["./", "detail", event.node.data.id], { relativeTo: this.activatedRoute });
  }
  // addroot() {
  //   this.router.navigate(["./", "create", 0], { relativeTo: this.activatedRoute });
  // }

  showdialog(selectedNode: TreeNode): void {
    this.selectedNode = selectedNode;
    this.accept_modal.show("حذف انجام شود؟");
  }
  dblclickfunction() {

    clearTimeout(this.sclicktimeout);
    this.dblorgUnitId.emit(this.selectedNode.data.id);
  }
  ngOnDestroy() {
    if (this.ref)
      this.ref.close();
  }
}
