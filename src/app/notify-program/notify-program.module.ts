import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotifyProgramRoutingModule } from './regulation-select-info/notify-program-routing.module';
import { NotifyProgramViewComponent } from './notify-program-view/notify-program-view.component';
import { RegulationSelectInfoComponent } from './regulation-select-info/regulation-select-info.component';
import { AddEditNotifyProgramComponent } from './add-edit-notify-program/add-edit-notify-program.component';
import {AppSharedModule} from '../app-shared/app-shared.module';
import {OrgUnitSharedModule} from '../basicinfo/org-unit/org-unit-shared/org-unit-shared.module';


@NgModule({
  declarations: [NotifyProgramViewComponent, RegulationSelectInfoComponent, AddEditNotifyProgramComponent],
  imports: [
    CommonModule,
    NotifyProgramRoutingModule,
    AppSharedModule,
    OrgUnitSharedModule
  ]
})
export class NotifyProgramModule { }
