import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from '../app-shared/app-shared.module';
import { BasicValueSharedModule } from '../basicinfo/basic-value/basic-value-shared/basic-value-shared.module';
import { OrgUnitSharedModule } from '../basicinfo/org-unit/org-unit-shared/org-unit-shared.module';
import { ExpertPersonSharedModule } from '../expert-person/expert-person-shared/expert-person-shared.module';
import { FormContainerModule } from '../form-container/form-container.module';
import { WorkflowSharedModule } from '../workflow/workflow-shared/workflow-shared.module';
import { ExpertApprovementAddComponent } from './expert-approvement-add/expert-approvement-add.component';
import { ExpertWorkingGroupCreateComponent } from './expert-working-group-create/expert-working-group-create.component';
import { ExpertWorkingGroupDetailComponent } from './expert-working-group-detail/expert-working-group-detail.component';
import { ExpertWorkingGroupEditComponent } from './expert-working-group-edit/expert-working-group-edit.component';
import { ExpertWorkingGroupListComponent } from './expert-working-group-list/expert-working-group-list.component';
import { ExpertWorkingGroupRoutingModule } from './expert-working-group-routing.module';

@NgModule({
  declarations: [
    ExpertWorkingGroupListComponent,
    ExpertWorkingGroupCreateComponent,
    ExpertWorkingGroupEditComponent,
    ExpertWorkingGroupDetailComponent,
    ExpertApprovementAddComponent],
  imports: [
    CommonModule,
    AppSharedModule,
    BasicValueSharedModule,
    ExpertPersonSharedModule,
    FormContainerModule,
    ExpertWorkingGroupRoutingModule,
    WorkflowSharedModule,
    OrgUnitSharedModule
  ]
})
export class ExpertWorkingGroupModule { }
