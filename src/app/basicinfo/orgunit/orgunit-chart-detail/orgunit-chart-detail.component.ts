import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { OrgunitService } from '../orgunit.service';
import { Orgunit, OrgunitWhitUser } from '../orgunit.model';

@Component({
  selector: 'app-orgunit-chart-detail',
  templateUrl: './orgunit-chart-detail.component.html',
  styleUrls: ['./orgunit-chart-detail.component.scss']
})
export class OrgunitChartDetailComponent implements OnInit {
  orgUnit: OrgunitWhitUser;
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private orgunitservice: OrgunitService) { }

  ngOnInit(): void {
    if (this.config.data.id) 
    this.loadData(this.config.data.id);
  }
  loadData(id: number) {
    this.orgunitservice.getOrgUnitWithDetails(id).subscribe(res => {

      if (res) {
        this.orgUnit = res;
      }

    }, error => {
      this.handleError(error);
    });
  }
  handleError(error: any) {
    throw new Error("Method not implemented.");
  }
}
