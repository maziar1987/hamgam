import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from 'src/app/app-shared/app-shared.module';
import { ActivitySharedModule } from '../cartable-new/activity-shared/activity-shared.module';
import { FormContainerButtonGroupComponent } from './form-container-button-group/form-container-button-group.component';
import { FormContainerToolbarComponent } from './form-container-toolbar/form-container-toolbar.component';
import { FormContainerComponent } from './form-container/form-container.component';
import { AliNameValidatorDirective } from './validators/ali-name-validator.directive';
import { ShabaNumberValidatorDirective } from './validators/shaba-number-validator.directive';

@NgModule({
  declarations: [
    FormContainerComponent,
    FormContainerButtonGroupComponent,
    FormContainerToolbarComponent,
    AliNameValidatorDirective,
    ShabaNumberValidatorDirective
  ],
  imports: [
    CommonModule,
    AppSharedModule,
    ActivitySharedModule
  ],
  exports: [
    ShabaNumberValidatorDirective
  ]
})
export class FormContainerModule { }
