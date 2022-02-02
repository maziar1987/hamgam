import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserListComponent } from './user-list/user-list.component';

const routes: Routes = [
  { path: '', component: UserListComponent },
  { path: 'create', component: UserEditComponent },
  { path: ':id', component: UserDetailComponent },
  { path: 'edit/:id', component: UserEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
