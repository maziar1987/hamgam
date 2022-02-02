import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from '../app-shared/app-shared.module';
import { PersonSharedModule } from '../basicinfo/person/person-shared/person-shared.module';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserManagementRoutingModule } from './user-management-routing.module';

@NgModule({
  declarations: [
    UserListComponent,
    UserEditComponent,
    UserDetailComponent
  ],
  imports: [
    CommonModule,
    AppSharedModule,
    PersonSharedModule,
    UserManagementRoutingModule
  ]
})
export class UserManagementModule { }
