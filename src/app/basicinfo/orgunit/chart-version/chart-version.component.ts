import { Component, OnInit } from '@angular/core';
import OrgChart from '@balkangraph/orgchart.js';
import { time } from 'console';

import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Key } from 'protractor';
import { persianDatePipe } from 'src/app/app-shared/pipes/persianDate.pipe';
import { chart } from '../chart.model';
import { ChartHistoryService } from '../charthistory.service';
import { PostLayout } from '../post.model';
declare function getchart();
declare function addChart(any);
@Component({
  selector: 'app-chart-version',
  templateUrl: './chart-version.component.html',
  styleUrls: ['./chart-version.component.scss']
})
export class ChartVersionComponent implements OnInit {
  charts: chart[];
  chartSelected: chart;
  items: any[];
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private service: ChartHistoryService,private date:persianDatePipe) { }

  ngOnInit(): void {
    this.service.getAllChart().subscribe(res => {
      // this.charts = res;
      console.warn("fffffffffffffffffff",res);
      this.charts=res.map(x=><chart>{key:x.key,createDate:this.date.transform(x.createDate)});
    });


    var chart;

    OrgChart.templates.myTemplate = Object.assign({}, OrgChart.templates.ana);
    OrgChart.templates.myTemplate.size = [200, 200];
    OrgChart.templates.myTemplate.node = '<circle cx="100" cy="140" r="60" fill="#4D4D4D" stroke-width="1" stroke="#1C1C1C"></circle>';


    OrgChart.templates.myTemplate.ripple = {
      radius: 100,
      color: "#0890D3",
      rect: null
    };
    OrgChart.templates.myTemplate.field_0 = '<text style="font-size: 16px;" fill="#ffffff" x="100" y="145" text-anchor="middle">{val}</text>';
    OrgChart.templates.myTemplate.edge = '<path  stroke="#686868" stroke-width="1px" fill="none" edge-id="[{id}][{child-id}]" d="M{xa},{ya} C{xb},{yb} {xc},{yc} {xd},{yd}"/>';

    OrgChart.templates.myTemplate.plus =
      '<rect x="0" y="0" width="36" height="36" rx="12" ry="12" fill="#2E2E2E" stroke="#aeaeae" stroke-width="1"></rect>'
      + '<line x1="4" y1="18" x2="32" y2="18" stroke-width="1" stroke="#aeaeae"></line>'
      + '<line x1="18" y1="4" x2="18" y2="32" stroke-width="1" stroke="#aeaeae"></line>';

    OrgChart.templates.myTemplate.minus =
      '<rect x="0" y="0" width="36" height="36" rx="12" ry="12" fill="#2E2E2E" stroke="#aeaeae" stroke-width="1"></rect>'
      + '<line x1="4" y1="18" x2="32" y2="18" stroke-width="1" stroke="#aeaeae"></line>';

    OrgChart.templates.myTemplate.expandCollapseSize = 36;

    OrgChart.templates.myTemplate.nodeMenuButton = '<g style="cursor:pointer;" transform="matrix(1,0,0,1,93,90)" control-node-menu-id="{id}"><rect x="-4" y="-10" fill="#000000" fill-opacity="0" width="22" height="22"></rect><line x1="0" y1="0" x2="0" y2="10" stroke-width="2" stroke="#0890D3" /><line x1="7" y1="0" x2="7" y2="10" stroke-width="2" stroke="#0890D3" /><line x1="14" y1="0" x2="14" y2="10" stroke-width="2" stroke="#0890D3" /></g>';

    OrgChart.templates.myTemplate.exportMenuButton = '<div style="position:absolute;right:{p}px;top:{p}px; width:40px;height:50px;cursor:pointer;" control-export-menu=""><hr style="background-color: #0890D3; height: 3px; border: none;"><hr style="background-color: #0890D3; height: 3px; border: none;"><hr style="background-color: #0890D3; height: 3px; border: none;"></div>';

    OrgChart.templates.myTemplate.pointer = '<g data-pointer="pointer" transform="matrix(0,0,0,0,100,100)"><g transform="matrix(0.3,0,0,0.3,-17,-17)"><polygon fill="#0890D3" points="53.004,173.004 53.004,66.996 0,120"/><polygon fill="#0890D3" points="186.996,66.996 186.996,173.004 240,120"/><polygon fill="#0890D3" points="66.996,53.004 173.004,53.004 120,0"/><polygon fill="#0890D3" points="120,240 173.004,186.996 66.996,186.996"/><circle fill="#0890D3" cx="120" cy="120" r="30"/></g></g>';


    OrgChart.templates.isla.plus = '<circle cx="15" cy="15" r="15" fill="#ffffff" stroke="#aeaeae" stroke-width="1"></circle>'
      + '<text text-anchor="middle" style="font-size: 18px;cursor:pointer;" fill="#757575" x="15" y="22">{collapsed-children-count}</text>';

    OrgChart.templates.group.plus = '<circle cx="15" cy="15" r="15" fill="#ffffff" stroke="#aeaeae" stroke-width="1"></circle>'
      + '<text text-anchor="middle" style="font-size: 18px;cursor:pointer;" fill="#757575" x="15" y="22">{collapsed-children-count}</text>';

    chart = new OrgChart(document.getElementById("historytree"), {
      template: "isla",
      enableDragDrop: false,
      showXScroll: OrgChart.scroll.visible,
      showYScroll: OrgChart.scroll.visible,
      // mouseScrool: OrgChart.action.ctrlZoom,
      mouseScrool: OrgChart.action.none,
      nodeMouseClick: OrgChart.action.none,
      nodeMouseDbClick: OrgChart.action.none,
      menu: {
        importCSV: {
          text: "آپلود CSV",
          icon: OrgChart.icon.csv(24, 24, '#7A7A7A'),
          onClick: function () { chart.importCSV(); }
        },
        csv: { text: "دریافت CSV", onClick: function () { chart.exportCSV(new Date().toLocaleString('fa-IR').replace(" ", "").replace("/", "_").replace("/", "_").replace(":", "_").replace(":", "_") + ".csv"); } }
      
      },
      nodeMenu: {
      },
      toolbar: {
        fullScreen: true,
        zoom: true,
        fit: true,
        expandAll: true
      },
      nodeBinding: {
        field_0: "name",
        field_1: "title",
        field_2: "orgid",
      },
      collapse: {
        level: 1,
        allChildren: true
      },
      tags: {
        "department": {
          template: "group",
          subTreeConfig: {

            collapse: {
              level: 1
            }
          },
          nodeMenu: {
            pdf: { text: "ذخیره pdf" },
            png: { text: "ذخیره PNG" }
          },
        },
        "post": {
          template: "isla",
          subTreeConfig: {

            collapse: {
              level: 1
            }
          },
          nodeMenu: {

            pdf: { text: "ذخیره pdf" },
            png: { text: "ذخیره PNG" }
          },
        },
        "root": {
          template: "myTemplate",


        },
      }
    });
    
    addChart(chart);
  }

  loadData(): void {
    var chart = getchart();
    var key=this.chartSelected.key;
      this.service.getAllOrg(key).subscribe(res => {

        var ff = res.map(x => <any>{ id: x.id, pid: x.parentId != null ? x.parentId : null, name: x.parentId != null ? x.displayName + " [" + x.code + "]" : x.displayName, tags: x.parentId != null ? ["department"] : ["root"] });
        this.service.getAllPost(key).subscribe(posts => {
          posts.forEach(post => {
            // if (post.parentId == null) {
            //   // if (post.postLayout==PostLayout.left) {
            //   //   ff.push(<any>{ id: post.id, stpid: post.organizationUnitId, /*name: "ali",*/ title: post.name, tags: ["post","assistant"]/*, img: "https://cdn.balkan.app/app-shared/1.jpg", tags: ["seo-menu"]*/ });
            //   // }
            //   // else{

            //   ff.push(<any>{ id: post.id, stpid: post.organizationUnitId, title: post.name, tags: ["post"],
            //   name:post.sentences.length>0? post.sentences[post.sentences.length-1].person.name +" "+post.sentences[post.sentences.length-1].person.lastName:"" });
            //   // }
            // }
            // else {
            // if (post.postLayout == PostLayout.left) {

            // ff.push(<any>{
            //   id: post.id, stpid: post.parentId == null ? post.organizationUnitId : null, pid: post.parentId != null ? post.parentId : null, title: post.name, tags: post.postLayout == PostLayout.left ? ["post", "assistant"] : ["post"],
            //   name: post.appointments.length > 0 ? post.appointments[post.appointments.length - 1].person.name + " " + post.appointments[post.appointments.length - 1].person.lastName : "",
            //   orgid: post.organizationUnitId
            // });
            ff.push(<any>{
              id: post.id, stpid: post.parentId == null ? post.orgUnitHistoryId : null, pid: post.parentId != null ? post.parentId : null, title: post.name, tags: post.postLayout.toString().toLocaleLowerCase() === PostLayout[PostLayout.left].toLocaleLowerCase() ? ["post", "assistant"] : ["post"],
              name: post.appointments.length > 0 ? post.appointments[0].personHistory.firstName + " " + post.appointments[post.appointments.length - 1].personHistory.lastName : "",
              orgid: post.orgUnitHistoryId
            });
            // }
            // else {

            //   ff.push(<any>{ id: post.id, pid: post.parentId, title: post.name, tags: ["post"],
            //   name:post.sentences.length>0? post.sentences[post.sentences.length-1].person.name +" "+post.sentences[post.sentences.length-1].person.lastName:"" });
            // }
            // }
            
          chart.load(ff);
          chart.draw();
          });

        });
      }, error => {
        this.handleError(error);
      });
      
    

  }
  handleError(error: any) {
    window.alert("error");
  }
}
