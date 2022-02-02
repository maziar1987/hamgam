import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SidebarService } from '../app-shared/components/sidebar/sidebar.service';
import { AuthService } from './auth.service';
import { FolderService } from '../cartable/services/folder.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateGuard implements CanActivate {
  constructor(
    private sidebarService: SidebarService,
    private folderService: FolderService,
    private userService: UserService,
    private router: Router,
    private authService: AuthService) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this.authService.isAuthenticated()) {
        // this.userService.getCurrentUser().subscribe(currentUser => {
        //   this.sidebarService.currentUser.firstName = currentUser.firstName;
        //   this.sidebarService.currentUser.lastName = currentUser.lastName;
        //   this.sidebarService.currentUser.authorities = currentUser.authorities;
        //   this.router.navigate(["/mana"]);
        //   return true;
        // }, error => {
        //   this.router.navigate(["/"]);
        //   console.error(error);
        //   return false;
        // });
        return true;
      } else {
        this.router.navigate(["/account/login"]);
        return false;
      }
    } 
  // getCurrentUser() {
  //   this.userService.getCurrentUser().subscribe(currentUser => {
  //     this.sidebarService.currentUser.firstName = currentUser.firstName;
  //     this.sidebarService.currentUser.lastName = currentUser.lastName;
  //      this.sidebarService.currentUser.authorities = currentUser.authorities;
  //      this.router.navigate(["/mana"]);
  //   }, error => {
  //     this.router.navigate(["/"]);
  //     console.error(error);
  //   });
  // }
}
