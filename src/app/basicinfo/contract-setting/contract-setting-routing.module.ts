import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PersonListComponent} from '../person/person-list/person-list.component';
import {ContractSettingComponent} from './contract-setting/contract-setting.component';


const routes: Routes = [
  { path: '', component: ContractSettingComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractSettingRoutingModule { }
