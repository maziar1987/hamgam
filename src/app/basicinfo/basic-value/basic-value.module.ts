import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
// import { BasicInfoService } from './basic-info.service';
import { AppSharedModule } from 'src/app/app-shared/app-shared.module';
import { BasicValueCreateComponent } from './basic-value-create/basic-value-create.component';
import { BasicValueDetailComponent } from './basic-value-detail/basic-value-detail.component';
import { BasicValueEditComponent } from './basic-value-edit/basic-value-edit.component';
// import { AppSharedModule } from 'src/app/app-shared/app-shared.module';
// import { BasicInfoCreateComponent } from './basic-info-create/basic-info-create.components';
// import { BasicInfoDetailComponent } from './basic-info-detail/basic-info-detail.components';
// import { BasicInfoEditComponent } from './basic-info-edit/basic-info-edit.components';
import { BasicValueListComponent } from './basic-value-list/basic-value-list.component';
import { BasicValueRoutingModule } from './basic-value-routing.module';


@NgModule({
  declarations: [
    BasicValueListComponent,
    BasicValueCreateComponent,
    BasicValueEditComponent,
    BasicValueDetailComponent
  ],
  imports: [
    CommonModule,
    AppSharedModule,
    BasicValueRoutingModule
  ]
})
export class BasicValueModule { }
