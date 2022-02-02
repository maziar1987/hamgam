import { Component, OnInit } from '@angular/core';
import { OrgunitService } from '../orgunit.service';

@Component({
  selector: 'app-orgunit-chart-base',
  templateUrl: './orgunit-chart-base.component.html',
  styleUrls: ['./orgunit-chart-base.component.scss']
})
export class OrgunitChartBaseComponent implements OnInit {

  constructor(
    private orgunitservice: OrgunitService) {
      this.orgunitservice.istree=false;
     }

  ngOnInit(): void {

  }

}
