import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpertPersonCreateComponent } from './expert-person-create/expert-person-create.component';
import { ExpertPersonDetailComponent } from './expert-person-detail/expert-person-detail.component';
import { ExpertPersonEditComponent } from './expert-person-edit/expert-person-edit.component';
import { ExpertPersonListComponent } from './expert-person-list/expert-person-list.component';


const routes: Routes = [
  { path: '', component: ExpertPersonListComponent },
  { path: 'create', component: ExpertPersonCreateComponent },
  { path: ':id', component: ExpertPersonDetailComponent },
  { path: 'edit/:id', component: ExpertPersonEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpertPersonRoutingModule { }
