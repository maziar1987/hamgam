import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from '../app-shared/app-shared.module';
import { BasicinfoRoutingModule } from './Basicinfo-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AppSharedModule,
    BasicinfoRoutingModule
  ]
})
export class BasicinfoModule { }
