import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {MenuItem, TreeNode} from 'primeng';
import {OrgUnit} from '../../models/org-unit';
import {OrgUnitService} from '../../services/org-unit.service';
import {utils} from '../../../../app-shared/utils';
import OrgChart from '@balkangraph/orgchart.js';
import tree = OrgChart.tree;

@Component({
  selector: 'app-org-unit-tree',
  templateUrl: './org-unit-tree.component.html',
  styleUrls: ['./org-unit-tree.component.scss']
})
export class OrgUnitTreeComponent implements OnInit {

  orgunits: OrgUnit[] = [];
  orgunitTreeNodes: TreeNode[] = [];
  utils: any;
  loading = false;
  emptyMessage = 'اطلاعاتی یافت نشد';

  @Input() minLengthLabel = false;
  @Input() buttonDisplay = false;
  @Input() deletedOrfUnit: OrgUnit;
  @Input() activeMode: boolean = null;
  @Output() onNodeSelect: EventEmitter<TreeNode> = new EventEmitter<TreeNode>();
  @Output() onView: EventEmitter<TreeNode> = new EventEmitter<TreeNode>();
  @Output() onCreate: EventEmitter<TreeNode> = new EventEmitter<TreeNode>();
  @Output() onEdit: EventEmitter<TreeNode> = new EventEmitter<TreeNode>();
  @Output() onDelete: EventEmitter<TreeNode> = new EventEmitter<TreeNode>();

  constructor(
    public orgUnitService: OrgUnitService
  ) {
  }

  getNodeLabel(node: TreeNode) {
    return node.label.length > 25 ? `${node.label.substring(0, 25)} ...` : node.label;
    if (this.minLengthLabel) {
      return node.label.length > 25 ? `${node.label.substring(0, 25)} ...` : node.label;
    } else {
      return node.label;
    }
  }

  ngOnInit(): void {
    this.loadData();
    this.utils = utils;
  }

  getMenuItems(node: TreeNode): MenuItem[] {
    return [
      {
        label: 'مشاهده', icon: 'pi pi-fw pi-eye', command: () => {
          this.view(node);
        }
      },
      {
        label: 'جدید', icon: 'pi pi-fw pi-plus', command: () => {
          this.create(node);
        }
      },
      {
        label: 'ویرایش', icon: 'pi pi-fw pi-pencil', command: () => {
          this.edit(node);
        }
      },
      {
        label: 'حذف', icon: 'pi pi-fw pi-times', command: () => {
          this.delete(node);
        }
      }
    ];
  }

  loadData(parent: TreeNode | null = null) {
    this.loading = true;
    this.orgUnitService.getOrgUnitByParentAndActivated(parent?.data?.id, this.activeMode).subscribe(orgUnits => {
      this.loading = false;
      this.orgunits = this.sortByDeactivated(orgUnits);
      // this.orgunits = orgUnits;
      this.createTree(this.orgunits, parent);
      if (this.orgunitTreeNodes.length > 0) {
        this.orgUnitService.selectedTreeNode = this.orgunitTreeNodes[0];
        this.onNodeSelect.emit(this.orgUnitService.selectedTreeNode);
      }
    }, error => {
      this.loading = false;
      this.handleError(error);
    });
  }

  sortByDeactivated(orgUnits: OrgUnit[]): OrgUnit[] {
    const oUnits = orgUnits.filter(x => x.activated === false);
    orgUnits = orgUnits.filter(x => x.activated === true);
    orgUnits = orgUnits.sort((a, b) => a.viewOrder < b.viewOrder ? 1 : -1);
    oUnits.forEach(value => {
      orgUnits.push(value);
    });
    return orgUnits;
  }

  createTree(orgUnits: OrgUnit[], parent: TreeNode | null = null) {
    const children = orgUnits.filter(x => x.parentId == parent?.data?.id);

    if (parent) {
      parent.children = [];
      children.forEach(child => {
        const newNode: TreeNode = this.orgUnitService.createTreeNode(child, parent);
        this.getChildCount(child.id, newNode);
        parent.children?.push(newNode);
        this.createTree(orgUnits, newNode);
      });
    } else {
      this.orgunitTreeNodes = [];
      children.forEach(child => {
        const newNode: TreeNode = this.orgUnitService.createTreeNode(child, parent);
        this.getChildCount(child.id, newNode);
        this.orgunitTreeNodes.push(newNode);
        this.createTree(orgUnits, newNode);
      });
    }
  }

  getChildCount(parentId: number, treeNode: TreeNode) {
    this.orgUnitService.countByParentId(parentId).subscribe(value => {
      if (value > 0) {
        treeNode.leaf = false;
      } else {
        treeNode.leaf = true;
      }
    });
  }

  nodeSelect(event) {
    // event.node = selected node
    this.onNodeSelect.emit(event.node);
  }

  nodeExpand(event) {
    if (event.node) {
      // in a real application, make a call to a remote url to load children of the current node and add the new nodes as children
      this.loadData(event.node);
    }
  }

  handleError(error: any) {
    console.error('orgUnitTree: ', error);
  }

  expandAll() {
    this.orgunitTreeNodes.forEach(node => {
      this.expandRecursive(node, true);
    });
  }

  collapseAll() {
    this.orgunitTreeNodes.forEach(node => {
      this.expandRecursive(node, false);
    });
  }

  private expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach(childNode => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }

  view(node: TreeNode) {
    this.orgUnitService.selectedTreeNode = node;
    this.onNodeSelect.emit(node);
    this.onView.emit(node);
  }

  create(node: TreeNode) {
    this.orgUnitService.selectedTreeNode = node;
    this.onNodeSelect.emit(node);
    this.onCreate.emit(node);
  }

  edit(node: TreeNode) {
    this.orgUnitService.selectedTreeNode = node;
    this.onNodeSelect.emit(node);
    this.onEdit.emit(node);
  }

  delete(node: TreeNode) {
    this.orgUnitService.selectedTreeNode = node;
    this.onNodeSelect.emit(node);
    this.onDelete.emit(node);
  }
}

