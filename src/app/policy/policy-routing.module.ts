import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditPolicyComponent } from './add-edit-policy/add-edit-policy.component';
import { PolicyListComponent } from './policy-list/policy-list.component';

const routes: Routes = [
  { path: 'list', component: PolicyListComponent },
  { path: 'create', component: AddEditPolicyComponent },
  { path: 'edit/:id', component: AddEditPolicyComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PolicyRoutingModule { }
