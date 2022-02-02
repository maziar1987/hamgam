import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuManagementLayoutComponent } from './menu-management-layout/menu-management-layout.component';

const routes: Routes = [
  { path: '', component: MenuManagementLayoutComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuManagementRoutingModule { }
