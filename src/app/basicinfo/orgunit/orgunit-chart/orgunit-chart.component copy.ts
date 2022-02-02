import { Component, OnInit, ViewChild } from '@angular/core';
import OrgChart from '@balkangraph/orgchart.js';
import {  TreeNode } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { AcceptComponent } from 'src/app/app-shared/components/accept/accept.component';
import { User } from 'src/app/user/user.model';
import { UserService } from 'src/app/user/user.service';
import { OrgunitCreate } from '../orgunit.model';
import { OrgunitService } from '../orgunit.service';
import { PostLayout, PostStatuse, PostType } from '../post.model';
import { PostService } from '../post.service';

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


@Component({
  selector: 'app-orgunit-chart',
  templateUrl: './orgunit-chart.component.html',
  styleUrls: ['./orgunit-chart.component.scss'],

})
export class OrgunitChartComponent extends BaseComponent implements OnInit {
  treeNodes: TreeNode[];
  selectedNode: TreeNode;
  users: User[];
  @ViewChild('accept_modal') accept_modal: AcceptComponent;
  menuItemViewLable: string;
  menuItemAddLable: string;
  menuItemUpdateLable: string;
  menuItemDeleteLable: string;
  ref: DynamicDialogRef;
  chart: OrgChart;
  orgunit: OrgunitCreate;
  // postType: PostType;
  postStatuses = PostStatuse;
  postLayouts = PostLayout;


  postTypes = PostType;
  // postTypekeys = Object.keys;


  constructor(
    public dialogService: DialogService,
    private orgunitservice: OrgunitService,
    private postservice: PostService,
    private userservice: UserService) {
    super();
  }

  ngOnInit(): void {
    // this.form = this.formBuilder.group({
    //   unitName: ['', [Validators.required, Validators.maxLength(255)]]
    // });
    this.chart = getchart();
    this.chart.on('remove', (sender, nodeId) => {
      this.orgunitservice.deleteorg(nodeId).subscribe(res => {
        this.successNotify( {detail:"حذف با موفقیت انجام شد",summary:"عملیات موفق"});

      }, error => {
        this.warningNotify({detail:error.error.error.message + "\r\n" + error.error.error.details,summary:"اخطار"});
        return false;
      })
    });
    this.loadData(this.chart);

  }
  loadData(chart: OrgChart): void {
    this.userservice.getAllUser().subscribe(res => {
      this.users = res.map(x => this.userservice.extendUser(x));
    })
    this.orgunitservice.getAllOrgUnit().subscribe(res => {

      var ff = res.filter(a => a.parentId != null).map(x => <any>{ id: x.id, pid: x.parentId, name: x.displayName, tags: ["department"] });
      this.postservice.getAllPost().subscribe(posts => {
        posts.forEach(post => {
          if (post.parentId == null) {
            ff.push(<any>{ id: post.id, stpid: post.organizationUnitId, name: "ali", title: post.name, tags: ["post"]/*, img: "https://cdn.balkan.app/app-shared/1.jpg", tags: ["seo-menu"]*/ });
          }
          else {
            ff.push(<any>{ id: post.id, pid: post.parentId, name: "ali", title: post.name, tags: ["post"]/*, img: "https://cdn.balkan.app/app-shared/1.jpg", tags: ["seo-menu"]*/ });
          }
        });

        chart.load(ff)
      });
    }, error => {
      this.handleError(error);
    });
  }

  unitSubmit() {
    if (unitformvaldation()) {
      var isupdate = getisupdate();
      if (isupdate) {
        var orgunit = <OrgunitCreate>getUnitEditData();

        console.warn("edit", orgunit);
        this.orgunitservice.editorg(orgunit).subscribe(res => {

          addnodetochart("");
          // this.notifySuccess("با موفقیت ویرایش شد","عملیات موفق");
          // this.messageService.add({ key: 'tl', severity: 'success', summary: "عملیات موفق", detail: "با موفقیت ویرایش شد" });
        }, error => {
          // this.notifyWarn(error.error.error.message + "\r\n" + error.error.error.details,"اخطار")

         // this.messageService.add({ key: 'tl', severity: 'warn', summary: 'اخطار', detail: error.error.error.message + "\r\n" + error.error.error.details });
        });
      }
      else {
        var orgunit = <OrgunitCreate>getUnitCreateData();
        console.warn("create", orgunit);
        var nodepid = getparenid();
        var nodstpid = getorgparentid();
        this.orgunitservice.createOrg(orgunit).subscribe(res => {

          addnodetochart(res);
          // this.notifySuccess( "با موفقیت ثبت شد","عملیات موفق")
       //   this.messageService.add({ key: 'tl', severity: 'success', summary: "عملیات موفق", detail: "با موفقیت ثبت شد" });
        },
          error => {
            // this.notifyWarn(error.error.error.message + "\r\n" + error.error.error.details,"اخطار")

         //   this.messageService.add({ key: 'tl', severity: 'warn', summary: "اخطار", detail: error.error.error.message + "\r\n" + error.error.error.details });
          });
      }


    }
    else {
      // this.notifyWarn("اطلاعات را به درستی وارد نمایید.","اخطار")
     // this.messageService.add({ key: 'tl', severity: 'warn', summary: "اخطار", detail: "اطلاعات را به درستی وارد نمایید." });
    }
  }


  postSubmit() {
    //  if (postformvaldation()) {
    //       var isupdate = getisupdate();
    //       if (isupdate) {
    //         var orgunit = <OrgunitCreate>getUnitEditData();

    //         console.warn("edit", orgunit);
    //         this.orgunitservice.editorg(orgunit).subscribe(res => {

    //           addnodetochart("");
    //           this.showSuccess("با موفقیت ویرایش شد");
    //         },
    //           error => {
    //             this.showWarn(error.error.error.message + "\r\n" + error.error.error.details);
    //           });
    //       }
    //       else {
    //         var orgunit = <OrgunitCreate>getUnitCreateData();
    //         console.warn("create", orgunit);
    //         var nodepid = getparenid();
    //         var nodstpid = getorgparentid();
    //         this.orgunitservice.createOrg(orgunit).subscribe(res => {

    //           addnodetochart(res);
    //           this.showSuccess("با موفقیت ثبت شد");
    //         },
    //           error => {
    //             this.showWarn(error.error.error.message + "\r\n" + error.error.error.details);
    //           });
    //       }


    //     }
    //     else {
    //       this.showWarn("اطلاعات را به درستی وارد نمایید.");
    //     }
  }

  handleError(error: any) {
    window.alert("error");
  }
}
