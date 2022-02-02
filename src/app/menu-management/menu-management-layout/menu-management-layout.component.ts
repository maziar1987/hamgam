import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { MenuItemDynamic } from 'src/app/app-shared/components/sidebar/models/menu-item-dynamic';
import { PolicySet } from 'src/app/policy/models/policy.model';
import { MenuManagementService } from '../services/menu-management.service';

@Component({
  selector: 'app-menu-management-layout',
  templateUrl: './menu-management-layout.component.html',
  styleUrls: ['./menu-management-layout.component.scss']
})
export class MenuManagementLayoutComponent extends BaseComponent implements OnInit {

  menus: TreeNode[] = [];
  menusTemp: TreeNode[] = [];
  selectedMenus: TreeNode[] = [];
  selectedPolicySet: PolicySet;

  constructor(
    private menuManagementService: MenuManagementService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.menuManagementService.getMenus().subscribe(result => {
      result.sort((a, b) => a.order > b.order ? 1 : -1)
      this.createMenuItems(result);
      this.setSelectedMenus();
    }, error => {
      console.error(error);
    });
  }

  createMenuItems(items: MenuItemDynamic[], parent: TreeNode | null = null) {
    var children;
    if (parent) {
      children = items.filter(x => x.parentId?.toString() == parent.data.id);
      if (children?.length > 0) {
        parent.children = [];
      }
      if (children?.length == 0) {
        parent.styleClass = 'noChildren';
      }

      children.forEach(child => {
        var newChild = this.createNewMenuItem(child, parent);
        parent.children = [...parent.children, newChild];
        this.createMenuItems(items, newChild);
      });
    } else {
      children = items.filter(x => x.parentId == null);
      if (children?.length > 0) {
        this.menus = [];
        this.menusTemp = [];
      }
      children.forEach(child => {
        var newChild = this.createNewMenuItem(child, null);
        this.menus = [...this.menus, newChild];
        this.createMenuItems(items, newChild);
      });
    }
  }

  createNewMenuItem(item: MenuItemDynamic, parent: TreeNode): TreeNode {
    var node = <TreeNode>{
      id: item.id.toString(),
      label: item.label,
      data: item,
      icon: item.icon,
      parent: parent,
      children: []
    };

    this.menusTemp.push(node);

    return node;
  }

  onSubmit() {
    console.log('selectedmenus', this.selectedMenus);
    this.selectedPolicySet.menusIds = this.selectedMenus.map(x => x.data.id);
    this.menuManagementService.setMenus(this.selectedPolicySet).subscribe(res => {
      this.successNotify({ detail: 'ذخیره سازی انجام شد', summary: 'عملیات موفق' });
    }, error => {
      console.error(error);
      this.selectedPolicySet.menusIds = [];
      this.errorNotify({ detail: 'خطای نا مشخص', summary: 'رخداد خطا' });
    });
  }

  selectedPolicyChanged(policy: PolicySet) {
    this.selectedPolicySet = policy;
    this.setSelectedMenus();
  }

  setSelectedMenus() {
    this.selectedMenus = this.menusTemp.filter(x => this.selectedPolicySet.menusIds.includes(x.data.id));
  }

  nodeSelect(event) {
    //event.node = selected node
    this.selectParentNodes(event.node);
    this.selectChildNodes(event.node);
  }

  selectParentNodes(node: TreeNode) {
    if (node.parent) {
      if (!this.selectedMenus.find(x => x.data.id == node.parent.data.id)) {
        this.selectedMenus = [...this.selectedMenus, node.parent];
        this.selectParentNodes(node.parent);
      }
    }
  }

  selectChildNodes(node: TreeNode) {
    node.children.forEach(child => {
      if (!this.selectedMenus.find(x => x.data.id == child.data.id)) {
        this.selectedMenus = [...this.selectedMenus, child];
        this.selectChildNodes(child);
      }
    });
  }

  nodeUnselect(event) {
    this.unSelectParentNodes(event.node);
    this.unSelectChildNodes(event.node);
  }

  unSelectParentNodes(node: TreeNode) {
    if (node.parent) {
      var unselect = true;
      node.parent.children.forEach(child => {
        if (this.selectedMenus.find(x => x.data.id == child.data.id)) {
          unselect = false;
        }
      });

      if (unselect) {
        this.selectedMenus = this.selectedMenus.filter(x => x.data.id != node.parent.data.id);
      }
    }
  }

  unSelectChildNodes(node: TreeNode) {
    node.children.forEach(child => {
      this.selectedMenus = this.selectedMenus.filter(x => x.data.id != child.data.id);
      this.unSelectChildNodes(child);
    });
  }

}
