import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from 'src/app/app-shared/app-shared.module';
import { BasicValueSharedModule } from '../basic-value/basic-value-shared/basic-value-shared.module';
import { OrgUnitSharedModule } from '../org-unit/org-unit-shared/org-unit-shared.module';
import { PersonDetailComponent } from './person-detail/person-detail.component';
import { PersonEditComponent } from './person-edit/person-edit.component';
import { PersonListComponent } from './person-list/person-list.component';
import { PersonRoutingModule } from './person-routing.module';

@NgModule({
  declarations: [
    PersonListComponent,
    PersonEditComponent,
    PersonDetailComponent
  ],
  imports: [
    CommonModule,
    AppSharedModule,
    BasicValueSharedModule,
    OrgUnitSharedModule,
    PersonRoutingModule
  ]
})
export class PersonModule { }
