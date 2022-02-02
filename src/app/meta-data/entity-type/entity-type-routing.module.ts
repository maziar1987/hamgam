import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntityTypeDetailComponent } from './entity-type-detail/entity-type-detail.component';
import { EntityTypeEditComponent } from './entity-type-edit/entity-type-edit.component';
import { EntityTypeListComponent } from './entity-type-list/entity-type-list.component';

const routes: Routes = [
  { path: '', component: EntityTypeListComponent },
  { path: 'create', component: EntityTypeEditComponent },
  { path: ':id', component: EntityTypeDetailComponent },
  { path: 'edit/:id', component: EntityTypeEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntityTypeRoutingModule { }
