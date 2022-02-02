import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpertWorkingGroupCreateComponent } from './expert-working-group-create/expert-working-group-create.component';
import { ExpertWorkingGroupDetailComponent } from './expert-working-group-detail/expert-working-group-detail.component';
import { ExpertWorkingGroupEditComponent } from './expert-working-group-edit/expert-working-group-edit.component';
import { ExpertWorkingGroupListComponent } from './expert-working-group-list/expert-working-group-list.component';


const routes: Routes = [
  { path: '', component: ExpertWorkingGroupListComponent },
  { path: 'create', component: ExpertWorkingGroupCreateComponent },
  { path: ':id', component: ExpertWorkingGroupDetailComponent },
  { path: 'edit/:id', component: ExpertWorkingGroupEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpertWorkingGroupRoutingModule { }
