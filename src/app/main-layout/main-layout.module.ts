import {  NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainLayoutRoutingModule } from './main-layout-routing.module';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { AppSharedModule } from '../app-shared/app-shared.module';
import { MessageService } from 'primeng';


@NgModule({
  declarations: [MainLayoutComponent],
  imports: [
    CommonModule,
    AppSharedModule,
    MainLayoutRoutingModule
  ],
  providers:[MessageService]
})
export class MainLayoutModule {

}
