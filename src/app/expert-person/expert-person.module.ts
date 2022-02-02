import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from 'src/app/app-shared/app-shared.module';
import { BasicValueSharedModule } from '../basicinfo/basic-value/basic-value-shared/basic-value-shared.module';
import { PersonSharedModule } from '../basicinfo/person/person-shared/person-shared.module';
import { WorkflowSharedModule } from '../workflow/workflow-shared/workflow-shared.module';
import { ExpertPersonCreateComponent } from './expert-person-create/expert-person-create.component';
import { ExpertPersonDetailComponent } from './expert-person-detail/expert-person-detail.component';
import { ExpertPersonEditComponent } from './expert-person-edit/expert-person-edit.component';
import { ExpertPersonListComponent } from './expert-person-list/expert-person-list.component';
import { ExpertPersonRoutingModule } from './expert-person-routing.module';

@NgModule({
  declarations: [
    ExpertPersonListComponent,
    ExpertPersonEditComponent,
    ExpertPersonCreateComponent,
    ExpertPersonDetailComponent
  ],
  imports: [
    CommonModule,
    AppSharedModule,
    PersonSharedModule,
    BasicValueSharedModule,
    WorkflowSharedModule,
    ExpertPersonRoutingModule
  ]
})
export class ExpertPersonModule { }
