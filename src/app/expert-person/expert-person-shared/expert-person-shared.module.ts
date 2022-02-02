import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from 'src/app/app-shared/app-shared.module';
import { ExpertPersonListSelectComponent } from './expert-person-list-select/expert-person-list-select.component';

@NgModule({
  declarations: [
    ExpertPersonListSelectComponent
  ],
  imports: [
    CommonModule,
    AppSharedModule
  ],
  exports: [
    ExpertPersonListSelectComponent
  ]
})
export class ExpertPersonSharedModule { }
