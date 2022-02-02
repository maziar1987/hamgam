import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/user/user.model';
import { UserService } from 'src/app/user/user.service';
import { Orgunit, OrgunitWhitUser } from '../orgunit.model';
import { OrgunitService } from '../orgunit.service';

@Component({
  selector: 'app-orgunit-detail',
  templateUrl: './orgunit-detail.component.html',
  styleUrls: ['./orgunit-detail.component.scss']
})
export class OrgunitDetailComponent implements OnInit {

  orgUnit: OrgunitWhitUser;
@Input() orgunitid:null;
  constructor(
    private route: ActivatedRoute,
    private orgunitservice: OrgunitService,) {

    this.orgUnit = <OrgunitWhitUser>{};
  }

  ngOnInit() {
    // this.route.params.subscribe(params => {
    //   var id = params['id'];
    //   this.loadData(this.orgunitid);
    // });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.orgunitid) 
    this.loadData(this.orgunitid);
  }
  loadData(id: number) {
    this.orgunitservice.getOrgUnitWithDetails(id).subscribe(res => {

      if (res) {
        this.orgUnit = res;
        //this.getuser(this.orgUnit.userid);
      }

    }, error => {
      this.handleError(error);
    });
  }
  handleError(error: any) {
    throw new Error("Method not implemented.");
  }

}
