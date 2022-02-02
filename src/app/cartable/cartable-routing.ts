import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivityListComponent } from './activity-list/activity-list.component';
import { CartableComponent } from './cartable/cartable.component';
import { ActivityViewComponent } from './activity-view/activity-view.component';
import { ActivityCreateComponent } from './activity-create/activity-create.component';
import { ActivityHistoryComponent } from './activity-history/activity-history.component';

const childRoutes: Routes = [
    { path: '', redirectTo: 'inbox', pathMatch: 'full' },

    { path: 'compose', component: ActivityCreateComponent },
    { path: 'send', component: ActivityCreateComponent },

    { path: ':name', component: ActivityListComponent },

    { path: 'folder/:id', component: ActivityListComponent },

    { path: 'forward/:id', component: ActivityCreateComponent },
    { path: 'reply/:id', component: ActivityCreateComponent },
    { path: 'return/:id', component: ActivityCreateComponent },

    { path: 'activity/:id', component: ActivityViewComponent },
    { path: 'history/:id', component: ActivityHistoryComponent },
];

const routes: Routes = [
    {
        path: '',
        component: CartableComponent,
        children: childRoutes
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class CartableRoutingModule { }





