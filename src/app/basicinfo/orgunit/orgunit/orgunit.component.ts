import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrgunitService } from '../orgunit.service';

@Component({
  selector: 'app-orgunit',
  templateUrl: './orgunit.component.html',
  styleUrls: ['./orgunit.component.scss']
})
export class OrgunitComponent implements OnInit {
  isTree: boolean = false;
  constructor(private activatedRoute: ActivatedRoute,
    private orgunitservice: OrgunitService,
    private router: Router) { }


  ngOnInit(): void {
    // this.activatedRoute.url.subscribe(p => {
    //   this.istree = p[1].path !== 'tree';
    // });
    // this.rout=this.activatedRoute.url.value.urlSegment[1];
    // this.activatedRoute.paramMap.subscribe(p => {
    //   this.rout = p.get('id');

    // });
  }

  showTree() {
    this.isTree = true;
    this.router.navigate(["definitions/orgUnits/tree"]);
  }
  showChart() {
    this.isTree = false;
    this.router.navigate(["definitions/orgUnits/chart"]);
  }
}
