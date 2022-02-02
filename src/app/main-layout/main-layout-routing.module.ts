import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormContainerComponent } from '../form-container/form-container/form-container.component';

const routes: Routes = [
  { path: '', redirectTo: 'cartable', pathMatch: 'full' },
  { path: 'oldcartable', loadChildren: () => import('../cartable/cartable.module').then(m => m.CartableModule) },
  { path: 'cartable', loadChildren: () => import('../cartable-new/cartable-new.module').then(m => m.CartableNewModule) },
  { path: 'basicinfo', loadChildren: () => import('../basicinfo/basicinfo.module').then(m => m.BasicinfoModule) },
  { path: 'policy', loadChildren: () => import('../policy/policy.module').then(m => m.PolicyModule) },
  { path: 'menu-management', loadChildren: () => import('../menu-management/menu-management.module').then(m => m.MenuManagementModule) },
  { path: 'user-management', loadChildren: () => import('../user-management/user-management.module').then(m => m.UserManagementModule) },
  { path: 'metaData', loadChildren: () => import('../meta-data/meta-data.module').then(m => m.MetaDataModule) },
  { path: 'experts', loadChildren: () => import('../expert-person/expert-person.module').then(m => m.ExpertPersonModule) },
  { path: 'workingGroups', component: FormContainerComponent, loadChildren: () => import('../expert-working-group/expert-working-group.module').then(m => m.ExpertWorkingGroupModule) },
  { path: 'regulations', component: FormContainerComponent, loadChildren: () => import('../regulations/regulations.module').then(m => m.RegulationsModule) },
  { path: 'notify', component: FormContainerComponent, loadChildren: () => import('../notify-program/notify-program.module').then(m => m.NotifyProgramModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainLayoutRoutingModule { }
