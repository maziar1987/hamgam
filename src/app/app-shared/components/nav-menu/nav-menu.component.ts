import { Component, Input, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/account/auth.service';
import { LoginService } from 'src/app/account/login/login.service';
import { SidebarService } from '../sidebar/sidebar.service';
import { NavMenuItem } from './nav-menu.model';
import { NavMenuService } from './nav-menu.service';


@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent implements OnInit {

  menuItems: NavMenuItem[] = [];
  @Input() activityCount: number | null = null;

  constructor(
    private navMenuService: NavMenuService,
    private sidebarService: SidebarService,
    private loginService: LoginService,
    private cookieService: CookieService,
    private authService: AuthService) {
    this.menuItems = this.navMenuService.getMenuItems();
  }

  ngOnInit(): void {

  }

  logout(): boolean {
    this.cookieService.delete(this.authService.AUTHENTICATE_COOKIE_NAME, "/");
    this.loginService.logout().subscribe(
      error => {
        console.error(error);
        return false;
      }
    );
    return true;
  }

  toggleSidebar() {
    this.sidebarService.toggle();
  }

  getSideBarState() {
    return this.sidebarService.sidebarState;
  }

  getTogglerIcon() {
    return this.getSideBarState() ? 'fa-angle-double-left' : 'fa-angle-double-right';
  }

}
