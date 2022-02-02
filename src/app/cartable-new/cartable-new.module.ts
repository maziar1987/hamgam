import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from '../app-shared/app-shared.module';
import { ActivityCardListComponent } from './activity-card-list/activity-card-list.component';
import { ActivityCreateComponent } from './activity-create/activity-create.component';
import { ActivityDetailComponent } from './activity-detail/activity-detail.component';
import { ActivityHistoryListComponent } from './activity-history-list/activity-history-list.component';
import { ActivityListLayoutComponent } from './activity-list-layout/activity-list-layout.component';
import { ActivityListComponent } from './activity-list/activity-list.component';
import { ActivitySharedModule } from './activity-shared/activity-shared.module';
import { CartableNewRoutingModule } from './cartable-new-routing.module';

@NgModule({
  declarations: [
    ActivityListLayoutComponent,
    ActivityListComponent,
    ActivityCardListComponent,
    ActivityDetailComponent,
    ActivityCreateComponent,
    ActivityHistoryListComponent
  ],
  imports: [
    CommonModule,
    AppSharedModule,
    ActivitySharedModule,
    CartableNewRoutingModule
  ]
})
export class CartableNewModule { }
