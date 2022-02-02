import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from 'src/app/app-shared/app-shared.module';
import { EntityTypeDetailComponent } from './entity-type-detail/entity-type-detail.component';
import { EntityTypeEditComponent } from './entity-type-edit/entity-type-edit.component';
import { EntityTypeListComponent } from './entity-type-list/entity-type-list.component';
import { EntityTypeRoutingModule } from './entity-type-routing.module';
import { EntityTypeShareModule } from './entity-type-share/entity-type-share.module';

@NgModule({
  declarations: [
    EntityTypeDetailComponent,
    EntityTypeEditComponent,
    EntityTypeListComponent
  ],
  imports: [
    CommonModule,
    AppSharedModule,
    EntityTypeShareModule,
    EntityTypeRoutingModule
  ]
})
export class EntityTypeModule { }
