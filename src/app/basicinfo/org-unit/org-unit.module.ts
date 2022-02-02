import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from 'src/app/app-shared/app-shared.module';
import { OrgUnitDetailComponent } from './org-unit-detail/org-unit-detail.component';
import { OrgUnitEditComponent } from './org-unit-edit/org-unit-edit.component';
import { OrgUnitLayoutComponent } from './org-unit-layout/org-unit-layout.component';
import { OrgUnitRoutingModule } from './org-unit-routing.module';
import { OrgUnitSharedModule } from './org-unit-shared/org-unit-shared.module';
import { OrgUnitFormComponent } from './org-unit-form/org-unit-form.component';

@NgModule({
  declarations: [
    OrgUnitLayoutComponent,
    OrgUnitEditComponent,
    OrgUnitDetailComponent,
    OrgUnitFormComponent
  ],
  imports: [
    CommonModule,
    AppSharedModule,
    OrgUnitSharedModule,
    OrgUnitRoutingModule
  ]
})
export class OrgUnitModule { }
