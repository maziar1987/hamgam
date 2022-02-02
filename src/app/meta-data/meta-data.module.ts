import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from '../app-shared/app-shared.module';
import { MetaDataRoutingModule } from './meta-data-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AppSharedModule,
    MetaDataRoutingModule
  ]
})
export class MetaDataModule { }
