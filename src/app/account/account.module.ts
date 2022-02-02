import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from '../app-shared/app-shared.module';
import { AccountRoutingModule } from './account-routing.module';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    AppSharedModule,
    AccountRoutingModule
  ]
})
export class AccountModule { }
