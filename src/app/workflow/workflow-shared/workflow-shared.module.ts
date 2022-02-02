import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from 'src/app/app-shared/app-shared.module';
import { BasicValueSharedModule } from 'src/app/basicinfo/basic-value/basic-value-shared/basic-value-shared.module';
import { WorkflowButtonGroupComponent } from './workflow-button-group/workflow-button-group.component';
import { WorkflowCreateActivityModalComponent } from './workflow-create-activity-modal/workflow-create-activity-modal.component';

@NgModule({
  declarations: [
    WorkflowButtonGroupComponent,
    WorkflowCreateActivityModalComponent
  ],
  imports: [
    CommonModule,
    BasicValueSharedModule,
    AppSharedModule
  ],
  exports: [
    WorkflowButtonGroupComponent,
    WorkflowCreateActivityModalComponent
  ]
})
export class WorkflowSharedModule { }
