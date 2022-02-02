import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntityFieldModalComponent } from './entity-field-modal/entity-field-modal.component';
import { AppSharedModule } from 'src/app/app-shared/app-shared.module';



@NgModule({
  declarations: [EntityFieldModalComponent],
  imports: [
    CommonModule,
    AppSharedModule
  ],
  exports: [EntityFieldModalComponent]
})
export class EntityTypeShareModule { }
