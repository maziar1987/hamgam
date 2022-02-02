import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from '../app-shared/app-shared.module';
import { ActivityCreateComponent } from './activity-create/activity-create.component';
import { ActivityDefaultTextCreateComponent } from './activity-default-text/activity-default-text-create/activity-default-text-create.component';
import { ActivityDefaultTextDeleteComponent } from './activity-default-text/activity-default-text-delete/activity-default-text-delete.component';
import { ActivityDefaultTextDropdownComponent } from './activity-default-text/activity-default-text-dropdown/activity-default-text-dropdown.component';
import { ActivityEditComponent } from './activity-edit/activity-edit.component';
import { ActivityHistoryComponent } from './activity-history/activity-history.component';
import { ActivityListComponent } from './activity-list/activity-list.component';
import { ActivityViewComponent } from './activity-view/activity-view.component';
import { CartableRoutingModule } from './cartable-routing';
import { CartableComponent } from './cartable/cartable.component';
import { FolderSelectComponent } from './folder-select/folder-select.component';
import { GetFolderNameComponent } from './get-folder-name/get-folder-name.component';
import { GetUsersComponent } from './get-users/get-users.component';

@NgModule({
  declarations: [
    ActivityListComponent,
    ActivityCreateComponent,
    ActivityEditComponent,
    ActivityViewComponent,
    CartableComponent,
    GetUsersComponent,
    ActivityHistoryComponent,
    ActivityDefaultTextCreateComponent,
    ActivityDefaultTextDropdownComponent,
    ActivityDefaultTextDeleteComponent,
    GetFolderNameComponent,
    FolderSelectComponent
  ],
  imports: [
    CommonModule,
    AppSharedModule,
    CartableRoutingModule
  ]
})
export class CartableModule { }
