import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {NotifyProgramViewComponent} from '../notify-program-view/notify-program-view.component';
import {AddEditNotifyProgramComponent} from '../add-edit-notify-program/add-edit-notify-program.component';
import {RegulationsAddEditComponent} from '../../regulations/components/add-edit/regulations-add-edit.component';



const routes: Routes = [
  { path: '', component: NotifyProgramViewComponent },
  { path: 'add-edit', component: AddEditNotifyProgramComponent },
  { path: 'add-edit/:id', component: AddEditNotifyProgramComponent },
  { path: 'add-edit/certificate/:id', component: RegulationsAddEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotifyProgramRoutingModule { }
