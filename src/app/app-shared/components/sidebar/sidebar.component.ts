import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AccountService } from 'src/app/account/account.service';
import { MenuManagementService } from 'src/app/menu-management/services/menu-management.service';
import { User } from 'src/app/user-management/models/user';
import { MenuItemDynamic } from './models/menu-item-dynamic';
import { SidebarMenuItem } from './sidebar.model';
import { SidebarService } from './sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('slide', [
      state('up', style({ height: 0 })),
      state('down', style({ height: '*' })),
      transition('up <=> down', animate(200))
    ])
  ]
})
export class SidebarComponent {
  items: MenuItem[];
  loading: boolean = false;
  currentUser: User;

  constructor(
    private sidebarservice: SidebarService,
    private accountService: AccountService,
    private menuManagementService: MenuManagementService) {

    accountService.currentAccount$.subscribe(currentUser => {
      this.currentUser = currentUser;
      if (currentUser) {
        this.getMenus();
      }
    });
  }

  getMenus() {
    this.loading = true;
    this.menuManagementService.getUserMenus(this.currentUser.id).subscribe(result => {
      this.loading = false;
      result.sort((a, b) => a.order > b.order ? 1 : -1)
      this.createMenuItems(result);
    }, error => {
      this.loading = false;
      console.error(error);
    });
  }

  createMenuItems(items: MenuItemDynamic[], parent: MenuItem | null = null) {
    var children;
    if (parent) {
      children = items.filter(x => x.parentId?.toString() == parent.id);
      if (children?.length > 0) {
        parent.items = [];
      }

      children.forEach(child => {
        var newChild = this.createNewMenuItem(child);
        parent.items = [...parent.items, newChild];
        this.createMenuItems(items, newChild);
      });
    } else {
      children = items.filter(x => x.parentId == null);
      if (children?.length > 0) {
        this.items = [];
      }
      children.forEach(child => {
        var newChild = this.createNewMenuItem(child);
        this.items = [...this.items, newChild];
        this.createMenuItems(items, newChild);
      });
    }
  }

  createNewMenuItem(item: MenuItemDynamic): MenuItem {
    return <MenuItem>{
      id: item.id.toString(),
      label: item.label,
      routerLink: item.routerLink,
      icon: item.icon
    };
  }

  get sideBarState() { return this.sidebarservice.sidebarState; }

  get currentUserAuthorities() {
    if (this.currentUser?.authorities?.length > 0) {
      return 'user.authorityType.' + this.currentUser?.authorities[0];
    }

    return '';
  }

  get policy() {
    var length = this.currentUser?.policySets?.length;
    if (length > 0) {
      return length > 1 ? `${this.currentUser.policySets[0].name} ...` : this.currentUser.policySets[0].name;
    }
    return '';
  }

  get policies() {
    return this.currentUser?.policySets?.length > 1 ? this.currentUser.policySets?.map(x => x.name)?.join('، ') : null;
  }

  toggle(currentLevelItems: SidebarMenuItem[], currentItem: SidebarMenuItem) {
    currentLevelItems.forEach(item => {
      if (item === currentItem) {
        currentItem.active = !currentItem.active;
      } else {
        item.active = false;
      }
    });
  }

  getState(currentItem: SidebarMenuItem) {
    if (currentItem.active) {
      return 'down';
    } else {
      return 'up';
    }
  }

}
