import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonDetailComponent } from './person-detail/person-detail.component';
import { PersonEditComponent } from './person-edit/person-edit.component';
import { PersonListComponent } from './person-list/person-list.component';

const routes: Routes = [
  { path: '', component: PersonListComponent },
  { path: 'create', component: PersonEditComponent },
  { path: ':id', component: PersonDetailComponent },
  { path: 'edit/:id', component: PersonEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonRoutingModule { }
