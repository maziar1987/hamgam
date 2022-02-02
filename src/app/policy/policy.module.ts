import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from '../app-shared/app-shared.module';
import { PolicyAssignComponent } from './policy-assign/policy-assign.component';
import { PolicyListComponent } from './policy-list/policy-list.component';
import { PolicyRoutingModule } from './policy-routing.module';
import { AddEditPolicyComponent } from './add-edit-policy/add-edit-policy.component';
import { PolicyFilterComponent } from './policy-filter/policy-filter.component';
import {QueryBuilderModule} from 'angular2-query-builder';
import {OrgUnitSharedModule} from '../basicinfo/org-unit/org-unit-shared/org-unit-shared.module';
import {PolicyAssignToUserComponent} from './policy-assign-to-user/policy-assign-to-user.component';
import { PolicyToUserComponent } from './policy-to-user/policy-to-user.component';
import { PolicyAssignUsersComponent } from './policy-assign-users/policy-assign-users.component';
import { PolicyUserSearchComponent } from './policy-user-search/policy-user-search.component';

@NgModule({
  declarations: [
    PolicyListComponent,
    PolicyAssignComponent,
    AddEditPolicyComponent,
    PolicyFilterComponent,
    PolicyAssignToUserComponent,
    PolicyToUserComponent,
    PolicyAssignUsersComponent,
    PolicyUserSearchComponent
  ],
    imports: [
        CommonModule,
        AppSharedModule,
        PolicyRoutingModule,
        QueryBuilderModule,
        OrgUnitSharedModule
    ]
})
export class PolicyModule { }
