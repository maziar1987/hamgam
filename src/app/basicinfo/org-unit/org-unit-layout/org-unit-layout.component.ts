import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TreeNode } from 'primeng';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { AcceptComponent } from 'src/app/app-shared/components/accept/accept.component';
import { OrgUnit } from '../models/org-unit';

@Component({
  selector: 'app-org-unit-layout',
  templateUrl: './org-unit-layout.component.html',
  styleUrls: ['./org-unit-layout.component.scss']
})
export class OrgUnitLayoutComponent extends BaseComponent implements OnInit {

  // tslint:disable-next-line:variable-name
  @ViewChild('accept_modal') accept_modal: AcceptComponent;
  treeButtonDisplay = true;
  selectedTreeNode: TreeNode;
  deletedOrgUnit: OrgUnit;
  addOrgUnit: OrgUnit;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
  }

  nodeSelect(event) {
    this.selectedTreeNode = event;
  }

  viewOrgUnit(treeNode: TreeNode) {
    this.router.navigate(['./', treeNode.data.id], { relativeTo: this.activatedRoute });
  }

  editOrgUnit(treeNode: TreeNode) {
    this.router.navigate(['./', 'edit', treeNode.data.id], { relativeTo: this.activatedRoute });
  }

  delete(node: TreeNode) {
    this.orgUnitService.deleteOrgUnit(node.data.id).subscribe(res => {
      this.successNotify({ detail: 'حذف انجام شد', summary: 'عملیات موفق' });
      node.parent.children = node.parent.children.filter(x => x.data.id !== node.data.id);
    }, error => {
      this.handleError(error);
    });
  }

  removeSelectedNode(orgUnit: OrgUnit) {
    this.selectedTreeNode.parent.children = this.selectedTreeNode.parent.children.filter(x => x.data.id !== orgUnit.id);
    this.orgUnitService.selectedTreeNode = this.selectedTreeNode.parent;
  }

  addNode(orgUnit: OrgUnit) {
    const treeNode = this.orgUnitService.createTreeNode(orgUnit, this.selectedTreeNode);
    this.selectedTreeNode.children = [...this.selectedTreeNode.children, treeNode];
    this.selectedTreeNode.children.sort((a, b) => a.data.viewOrder < b.data.viewOrder ? 1 : -1);
    this.orgUnitService.selectedTreeNode = treeNode;
  }

  handleError(error: any) {
    console.error(error);
    this.errorNotify({ detail: 'خطای نا مشخص', summary: 'رخداد خطا' });
  }

}

