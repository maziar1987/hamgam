import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from 'src/app/app-shared/app-shared.module';
import { OrgUnitTreeComponent } from './org-unit-tree/org-unit-tree.component';

@NgModule({
  declarations: [
    OrgUnitTreeComponent
  ],
  imports: [
    CommonModule,
    AppSharedModule
  ],
  exports: [
    OrgUnitTreeComponent
  ]
})
export class OrgUnitSharedModule { }
