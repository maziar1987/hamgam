import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BasicValueCreateComponent } from './basic-value-create/basic-value-create.component';
import { BasicValueDetailComponent } from './basic-value-detail/basic-value-detail.component';
import { BasicValueEditComponent } from './basic-value-edit/basic-value-edit.component';
import { BasicValueListComponent } from './basic-value-list/basic-value-list.component';

const routes: Routes = [
    { path: '', component: BasicValueListComponent },
    { path: 'create', component: BasicValueCreateComponent },
    { path: 'create/:id', component: BasicValueCreateComponent },
    { path: ':id', component: BasicValueDetailComponent },
    { path: 'edit/:id', component: BasicValueEditComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class BasicValueRoutingModule { }
