import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from 'src/app/app-shared/app-shared.module';
import { BasicValueDropdownComponent } from './basic-value-dropdown/basic-value-dropdown.component';



@NgModule({
  declarations: [
    BasicValueDropdownComponent
  ],
  imports: [
    CommonModule,
    AppSharedModule
  ],
  exports: [
    BasicValueDropdownComponent
  ]
})
export class BasicValueSharedModule { }
