import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivityCreateComponent } from './activity-create/activity-create.component';
import { ActivityDetailComponent } from './activity-detail/activity-detail.component';
import { ActivityHistoryListComponent } from './activity-history-list/activity-history-list.component';
import { ActivityListLayoutComponent } from './activity-list-layout/activity-list-layout.component';

const routes: Routes = [
  { path: '', redirectTo: 'inbox', pathMatch: 'full' },
  { path: 'inbox', component: ActivityListLayoutComponent },
  { path: 'outbox', component: ActivityListLayoutComponent },
  { path: 'archive', component: ActivityListLayoutComponent },
  { path: 'trash', component: ActivityListLayoutComponent },
  {
    path: ':folderName', children: [
      {
        path: 'activity', children: [
          { path: 'compose', component: ActivityCreateComponent },
          { path: 'forward/:id', component: ActivityCreateComponent },
          { path: 'reply/:id', component: ActivityCreateComponent },
          { path: 'sendBack/:id', component: ActivityCreateComponent },
          { path: 'history/:id', component: ActivityHistoryListComponent },
          { path: ':id', component: ActivityDetailComponent }
        ]
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartableNewRoutingModule { }
