import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrgUnitDetailComponent } from './org-unit-detail/org-unit-detail.component';
import { OrgUnitEditComponent } from './org-unit-edit/org-unit-edit.component';

const routes: Routes = [
  {
    path: '', children: [
      { path: 'create/:id', component: OrgUnitEditComponent },
      { path: ':id', component: OrgUnitDetailComponent },
      { path: 'edit/:id', component: OrgUnitEditComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrgUnitRoutingModule { }
