import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/app-shared/base/base.component';

declare function getchart();
declare function addnodetochart(string);
declare function getparenid();
declare function getorgparentid();
declare function getisupdate()
declare function unitformvaldation();
declare function getUnitCreateData();
declare function getUnitEditData();
declare function getUnitid();
declare function test(string);


declare function postformvaldation();
declare function addThat(any);
declare function addChart(any);
declare function addOrgchartnodeid(any);
declare function addnodeparentid(any);
declare function addnodeorgparentid(any);
declare function addisupdate(any);


@Component({
  selector: 'app-orgunit-chart',
  templateUrl: './orgunit-chart.component.html',
  styleUrls: ['./orgunit-chart.component.scss'],

})
export class OrgunitChartComponent extends BaseComponent implements OnInit {

  orgunitid: string;

  dblorgunitid: string;
  constructor() {
    super();
  }

  ngOnInit(): void {

  }

  orgUnitIdEmited(event) {
    this.orgunitid = event;
  }
  dblorgUnitIdEmited(event) {
    this.dblorgunitid = event;
  }
}
