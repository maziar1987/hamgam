import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from 'src/app/app-shared/app-shared.module';
import { PersonSearchComponent } from './person-search/person-search.component';

@NgModule({
  declarations: [
    PersonSearchComponent
  ],
  imports: [
    CommonModule,
    AppSharedModule
  ],
  exports: [
    PersonSearchComponent
  ]
})
export class PersonSharedModule { }
