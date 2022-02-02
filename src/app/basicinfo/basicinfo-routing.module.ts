import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrgUnitLayoutComponent } from './org-unit/org-unit-layout/org-unit-layout.component';
import { OrgunitComponent } from './orgunit/orgunit/orgunit.component';
// import {YeganListComponent} from './yegan/yegan-list/yegan-list.component';


const routes: Routes = [
  { path: '', redirectTo: 'basicvalue', pathMatch: 'full' },
  { path: 'basicvalue', loadChildren: () => import('./basic-value/basic-value.module').then(m => m.BasicValueModule) },
  { path: 'orgUnits', component: OrgunitComponent, loadChildren: () => import('./orgunit/orgunit.module').then(m => m.OrgunitModule) },
  { path: 'orgUnit', component: OrgUnitLayoutComponent, loadChildren: () => import('./org-unit/org-unit.module').then(m => m.OrgUnitModule) },
  { path: 'people', loadChildren: () => import('./person/person.module').then(m => m.PersonModule) },
  { path: 'contract', loadChildren: () => import('./contract-setting/contract-setting.module').then(m => m.ContractSettingModule) },
  { path: 'payment', loadChildren: () => import('./payment/payment.module').then(m => m.PaymentModule) }
  // {path: 'yegan', component: YeganListComponent, loadChildren: () => import('./yegan/yegan.module').then(m => m.YeganModule)}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BasicinfoRoutingModule {
}
