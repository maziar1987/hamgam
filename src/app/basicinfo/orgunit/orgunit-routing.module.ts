import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrgunitChartBaseComponent } from './orgunit-chart-base/orgunit-chart-base.component';


const routes: Routes = [
  { path: '', redirectTo: 'chart', pathMatch: 'full' },
 
{
    path: 'chart', component: OrgunitChartBaseComponent, children: []
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrgunitRoutingModule { }
