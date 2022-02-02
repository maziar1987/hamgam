import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', redirectTo: 'entityType', pathMatch: 'full' },
  { path: 'entityType', loadChildren: () => import('./entity-type/entity-type.module').then(m => m.EntityTypeModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MetaDataRoutingModule { }
