import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from '../app-shared/app-shared.module';
import { PolicySetSharedModule } from '../policy/policy-set-shared/policy-set-shared.module';
import { MenuManagementLayoutComponent } from './menu-management-layout/menu-management-layout.component';
import { MenuManagementRoutingModule } from './menu-management-routing.module';

@NgModule({
  declarations: [
    MenuManagementLayoutComponent
  ],
  imports: [
    CommonModule,
    AppSharedModule,
    PolicySetSharedModule,
    MenuManagementRoutingModule
  ]
})
export class MenuManagementModule { }
