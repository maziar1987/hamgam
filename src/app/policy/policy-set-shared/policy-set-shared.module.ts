import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from 'src/app/app-shared/app-shared.module';
import { PolicySetNameListComponent } from './policy-set-name-list/policy-set-name-list.component';

@NgModule({
  declarations: [PolicySetNameListComponent],
  imports: [
    CommonModule,
    AppSharedModule
  ],
  exports: [PolicySetNameListComponent]
})
export class PolicySetSharedModule { }
