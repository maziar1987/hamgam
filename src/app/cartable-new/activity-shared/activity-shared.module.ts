import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from 'src/app/app-shared/app-shared.module';
import { ActivityButtonGroupComponent } from './activity-button-group/activity-button-group.component';
import { ActivityCreateModalComponent } from './activity-create-modal/activity-create-modal.component';
import { ActivityDefaultTextDropdownComponent } from './activity-default-text-dropdown/activity-default-text-dropdown.component';

@NgModule({
  declarations: [
    ActivityCreateModalComponent,
    ActivityDefaultTextDropdownComponent,
    ActivityButtonGroupComponent
  ],
  imports: [
    CommonModule,
    AppSharedModule
  ],
  exports: [
    ActivityCreateModalComponent,
    ActivityDefaultTextDropdownComponent,
    ActivityButtonGroupComponent
  ]
})
export class ActivitySharedModule { }
