import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from 'src/app/app-shared/app-shared.module';
import { OrgunitTreeComponent } from './orgunit-tree/orgunit-tree.component';
import { OrgunitComponent } from './orgunit/orgunit.component';
import { OrgunitDetailComponent } from './orgunit-detail/orgunit-detail.component';
import { OrgunitChartComponent } from './orgunit-chart/orgunit-chart.component';
import { OrgunitChartBaseComponent } from './orgunit-chart-base/orgunit-chart-base.component';
import { OrgunitChartDetailComponent } from './orgunit-chart-detail/orgunit-chart-detail.component';
import { HitxOrgchartComponent } from './hitx-orgchart/hitx-orgchart.component';
import { ChangeDetectorComponent } from './change-detector/change-detector.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { SentenceCreateComponent } from './sentence-create/sentence-create.component';
import { OrguniPostsDetailComponent } from './orguni-posts-detail/orguni-posts-detail.component';
import { PostMoveComponent } from './post-move/post-move.component';
import { OrgunitMoveComponent } from './orgunit-move/orgunit-move.component';
import { ChartVersionComponent } from './chart-version/chart-version.component';
import { OrgunitRoutingModule } from './orgunit-routing.module';



@NgModule({
  declarations: [
    OrgunitComponent,
    OrgunitTreeComponent,
    OrgunitDetailComponent,
    OrgunitChartComponent,
    OrgunitChartBaseComponent,
    OrgunitChartDetailComponent,
    HitxOrgchartComponent,
    ChangeDetectorComponent,
    PostDetailComponent,
    SentenceCreateComponent,
    OrguniPostsDetailComponent,
    PostMoveComponent,
    OrgunitMoveComponent,
    ChartVersionComponent
  ],
  imports: [
    CommonModule,
    AppSharedModule,
    OrgunitRoutingModule
  ]
})
export class OrgunitModule { }
