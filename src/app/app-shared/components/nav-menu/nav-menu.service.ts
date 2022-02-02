import { Injectable } from '@angular/core';
import { NavMenuItem } from './nav-menu.model';

@Injectable({
    providedIn: 'root'
})
export class NavMenuService {

    menuItems: NavMenuItem[] = [];

    constructor() {
        // this.menuItems = [
        //     {
        //         lable: 'navMenu.dashboard',
        //         link: '/dashboard'
        //     },
        //     {
        //         lable: 'navMenu.cartable',
        //         link: '/cartable'
        //     },
        //     {
        //         lable: 'navMenu.definitions',
        //         link: '/definitions'
        //     }
        // ];
    }

    getMenuItems() {
        return this.menuItems;
    }
}