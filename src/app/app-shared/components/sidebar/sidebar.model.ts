import { MenuItem } from 'primeng/api';

export interface SidebarMenuItem {
    lable: string;
    type: SidebarMenuItemType;
    link?: string;
    icon?: string;
    activeIcon?: string;
    data?: any;
    disable?: boolean;
    visible?: boolean;
    active?: boolean;
    open?: boolean;
    items?: SidebarMenuItem[];
    badge?: SidebarMenuItemBadge;
    unreadCount?: number;
    dataType?: any;
    cssClass?: string;
    menuItems?: MenuItem[];
    parent?: SidebarMenuItem;
}

export interface SidebarMenuItemBadge {
    text: string;
    class: string;
}

export enum SidebarMenuItemType {
    header,
    dropdown,
    simple
}

export interface DeleteItem {
    sidebarMenuItem: SidebarMenuItem,
    sidebarMenuItems: SidebarMenuItem[],
    parentItem: SidebarMenuItem
}