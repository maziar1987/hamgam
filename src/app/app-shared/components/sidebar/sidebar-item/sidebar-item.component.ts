import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { DeleteItem, SidebarMenuItem, SidebarMenuItemType } from '../sidebar.model';

@Component({
  selector: 'app-sidebar-item',
  templateUrl: './sidebar-item.component.html',
  styleUrls: ['./sidebar-item.component.scss'],
  animations: [
    trigger('slide', [
      state('up', style({ height: 0 })),
      state('down', style({ height: '*' })),
      transition('up <=> down', animate(200))
    ])
  ]
})
export class SidebarItemComponent implements OnInit {

  sidebarMenuItemTypes = SidebarMenuItemType;
  // folderTypes = FolderType;
  @Input() sidebarMenuItems: SidebarMenuItem[] = [];
  @Input() level: number = 0;
  @Input() parentItem: SidebarMenuItem;

  // @Output() deleteItem: EventEmitter<DeleteItem> = new EventEmitter();
  // @Output() createItem: EventEmitter<SidebarMenuItem> = new EventEmitter();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
  }

  toggle(currentLevelItems: SidebarMenuItem[], currentItem: SidebarMenuItem) {
    currentLevelItems.forEach(item => {
      if (item === currentItem) {
        currentItem.active = !currentItem.active;
      } else {
        item.active = false;
      }
    });

    if (currentItem.link) {
      this.router.navigate([currentItem.link]);
    }
  }

  getState(currentItem: SidebarMenuItem) {
    if (currentItem.active) {
      return 'down';
    } else {
      return 'up';
    }
  }

  // getMenuItems(sidebarMenuItem: SidebarMenuItem): MenuItem[] {
  //   var menuItems = <MenuItem[]>[
  //     {
  //       label: "افزودن", icon: 'pi pi-plus text-success', command: () => {
  //         this.onCreate(sidebarMenuItem);
  //       }
  //     },
  //     {
  //       label: "حذف", icon: 'pi pi-times text-danger', command: () => {
  //         this.onDelete(sidebarMenuItem, sidebarMenuItems);
  //       }
  //     }
  //   ];

  //   return menuItems;
  // }

  // onCreate(menu: SidebarMenuItem) {
  //   this.createItem.emit(menu);
  // }

  // onDelete(sidebarMenuItem: SidebarMenuItem, sidebarMenuItems: SidebarMenuItem[]) {
  //   this.deleteItem.emit(<DeleteItem>{
  //     sidebarMenuItem: sidebarMenuItem,
  //     sidebarMenuItems: sidebarMenuItems,
  //     parentItem: this.parentItem
  //   });
  // }

  togglePopupmenu(popupmenu, event) {
    event.stopPropagation();
    event.preventDefault();

    popupmenu.toggle(event)
  }

}
