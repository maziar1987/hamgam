import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { SidebarService } from 'src/app/app-shared/components/sidebar/sidebar.service';
import { ActivityService } from 'src/app/cartable-new/services/activity.service';
import { FolderService } from 'src/app/cartable/services/folder.service';
import { User } from 'src/app/user-management/models/user';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],

})
export class MainLayoutComponent extends BaseComponent implements OnInit, OnDestroy {

  unSeenActivityCount: number | null = null;
  currentUser: User;
  unSeenSubscription: Subscription;

  constructor(
    private sidebarService: SidebarService,
    private folderService: FolderService,
    private activityService: ActivityService) {
    super();

    this.unSeenSubscription = interval(20000)
      .subscribe((val) => {
        this.checkUnSeenActivity();
      });

  }

  ngOnInit(): void {
    this.accountService.loadCurrentAccount();
    this.folderService.setUserFolders();

  }

  ngOnDestroy(): void {
    this.unSeenSubscription.unsubscribe();
  }

  checkUnSeenActivity() {
    this.activityService.getUnSeenActivityCount(this.currentUser?.id).subscribe(count => {
      if (count) {
        this.unSeenActivityCount = count;
      } else {
        this.unSeenActivityCount = null;
      }
    }, error => {
      console.error(error);
    });
  }

  toggleSidebar() {
    this.sidebarService.toggle();
  }

  getSideBarState() {
    return this.sidebarService.sidebarState;
  }

}
