import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractSettingRoutingModule } from './contract-setting-routing.module';
import { ContractSettingComponent } from './contract-setting/contract-setting.component';
import {AppSharedModule} from '../../app-shared/app-shared.module';
import {InputNumberModule} from 'primeng';


@NgModule({
  declarations: [ContractSettingComponent],
  imports: [
    CommonModule,
    ContractSettingRoutingModule,
    AppSharedModule,
    InputNumberModule,
  ]
})
export class ContractSettingModule { }
