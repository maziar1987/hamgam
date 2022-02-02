import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import OrgChart from '@balkangraph/orgchart.js';
import { TreeNode } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { Pagination } from 'src/app/app-shared/base/pagination.model';
import { AcceptComponent } from 'src/app/app-shared/components/accept/accept.component';
import { User } from 'src/app/user/user.model';
import { UserService } from 'src/app/user/user.service';
import { ChartVersionComponent } from '../chart-version/chart-version.component';
import { ChartHistoryService } from '../charthistory.service';
import { OrgunitChartDetailComponent } from '../orgunit-chart-detail/orgunit-chart-detail.component';
import { OrgunitMoveComponent } from '../orgunit-move/orgunit-move.component';
import { Orgunit, OrgunitCreate } from '../orgunit.model';
import { OrgunitService } from '../orgunit.service';
import { PersonExtended } from '../person.model';
import { PostDetailComponent } from '../post-detail/post-detail.component';
import { PostMoveComponent } from '../post-move/post-move.component';
import { Post, PostCreate, PostEdit, PostLayout, PostStatuse, PostType } from '../post.model';
import { PostService } from '../post.service';
import { SentenceCreateComponent } from '../sentence-create/sentence-create.component';

declare function getchart();
declare function addOrgToChart(string);
declare function getparenid();
declare function getorgparentid();
declare function getisupdate()
declare function unitformvaldation();
declare function getUnitCreateData();
declare function getUnitEditData();
declare function addnodeid(any);
declare function getId();
declare function getNodeId();


declare function postformvaldation();
declare function addThat(any);
declare function addChart(any);
declare function addOrgchartnodeid(any);
declare function addnodeparentid(any);
declare function addnodeorgparentid(any);
declare function addisupdate(any);
declare function getPostCreateData();
declare function getPostEditData();

declare function addposttochart(newid, organizationUnitId, parentId, orgid, layout);
@Component({
  selector: 'app-hitx-orgchart',
  templateUrl: './hitx-orgchart.component.html',
  styleUrls: ['./hitx-orgchart.component.scss']
})
export class HitxOrgchartComponent extends BaseComponent implements OnInit, OnDestroy {
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
  hitxOrgchartComponent = HitxOrgchartComponent;
  static onaddman: boolean;
  static ondetail: boolean;
  static onmovepost: boolean;
  static onsen: boolean;
  static onpostmode: boolean;
  static onunitmode: boolean;
  static savehistory: boolean;
  static showVersion: boolean;
  static first: boolean = true;
  posts: Post[];

  dirmanger: any;
  postLayouTemp: any;
  postStatusTemp: any;
  postTypeTemp: any;
  postCreateTemp: PostCreate;
  postEditTemp: PostEdit;
  orgunittree: any;
  postModData: any[];
  @Input() orgUnitId: string;

  @Output() orgUnitIdout = new EventEmitter<string>();
  @Output() dblorgUnitId = new EventEmitter<string>();
  constructor(
    public dialogService: DialogService,
    private orgunitservice: OrgunitService,
    private postService: PostService,
    private userservice: UserService, private chartService: ChartHistoryService) {
    super();
  }


  ngOnInit(): void {
    // this.form = this.formBuilder.group({
    //   unitName: ['', [Validators.required, Validators.maxLength(255)]]
    // });



    var that;
    var chart;
    var orgchartnodeid = 0;
    var publicnode;
    // var nodeparentid;
    // var nodeorgparentid;
    var postService1 = this.postService;
    //  var kkk=new OrgunitChartComponent(DialogService,Router,ActivatedRoute,FormBuilder,OrgunitService,PostService,UserService);

    function editForm() {
      this.nodeId = null;
    };

    editForm.prototype.init = function (obj) {
      that = this;
      addThat(that);
      this.obj = obj;
      this.mask = document.getElementById("mask");
      this.unitForm = document.getElementById("unitForm");
      this.unitNameInput = document.getElementById("unitName");
      this.unitCodeInput = document.getElementById("unitCode");
      this.unitCancelButton = document.getElementById("unitCancel");
      this.unitSaveButton = document.getElementById("unitSave");


      this.postForm = document.getElementById("postForm");
      this.postTitleInput = document.getElementById("postTitle");
      // this.postTitleInput = document.getElementById("postTitle");
      this.postCancelButton = document.getElementById("postCancel");
      this.postSaveButton = document.getElementById("postSave");


    };

    editForm.prototype.show = function (nodeId, isdetail) {
      console.warn("node", chart);
      that = this;
      addThat(that);
      orgchartnodeid = nodeId;
      addOrgchartnodeid(orgchartnodeid);
      publicnode = chart.get(nodeId);
      if (typeof (publicnode.pid) != 'undefined' && publicnode.pid != null) {
        // console.warn("ppppppppppppppppppp", publicnode.pid);
        addnodeparentid(publicnode.pid);
        if (typeof (publicnode.tags) != 'undefined' && publicnode.tags != null) {       //اگر تگ داشت
          var isDeprtment = publicnode.tags.indexOf("department") != -1;

          if (isDeprtment != true) {
            var parent = chart.get(publicnode.pid);
            alert(publicnode.orgid);
            addnodeorgparentid(publicnode.orgid);
          }
          else {
            addnodeorgparentid("");
          }
        }

      }
      else {
        addnodeparentid("");
        addnodeorgparentid(publicnode.orgid);
      }

      this.mask = document.getElementById("mask");

      this.unitForm = document.getElementById("unitForm");
      this.unitNameInput = document.getElementById("unitName");
      this.unitCodeInput = document.getElementById("unitCode");
      // this.titleInput = document.getElementById("title");
      this.unitCancelButton = document.getElementById("unitCancel");
      this.unitSaveButton = document.getElementById("unitSave");
      this.unitCancelButton.addEventListener("click", function () {
        that.hide();
      });


      this.postForm = document.getElementById("postForm");
      this.postTitleInput = document.getElementById("postTitle");
      // this.postTitleInput = document.getElementById("postTitle");
      this.postCancelButton = document.getElementById("postCancel");
      this.postSaveButton = document.getElementById("postSave");
      this.postCancelButton.addEventListener("click", function () {
        that.hide();
      });


      var omask = document.getElementById("mask");
      omask.classList.add("d-inline-block");
      omask.classList.remove("d-none");
      var node = chart.get(nodeId);
      this.nodeId = nodeId;
      if (typeof (node.tags) != 'undefined' && node.tags != null) {       //اگر تگ داشت
        var isDeprtment = node.tags.indexOf("department") != -1;

        if (isDeprtment == true) {          // اگر واحد بود

          if (typeof (isdetail) != 'undefined') { //اگر فرم در حالت جزییات باز شده بود باید دکمه های  فرم حذف شود

            var myobj = document.getElementById("unitbtncontent");
            myobj.classList.remove("d-inline-block");
            myobj.classList.add("d-none");

          }
          var left = document.body.offsetWidth / 2 - 150;
          this.unitForm.style.display = "block";
          this.unitForm.style.left = left + "px";
          this.unitNameInput.value = node.name.split('[')[0].trim();
          this.unitCodeInput.value = node.name.split('[')[1].trim().split(']')[0];
        }
        else {//اگر پست بود

          if (typeof (isdetail) != 'undefined') { //اگر فرم در حالت جزییات باز شده بود باید دکمه های  فرم حذف شود

            var myobj = document.getElementById("postbtncontent");
            myobj.classList.remove("d-inline-block");
            myobj.classList.add("d-none");

          }
          var left = document.body.offsetWidth / 2 - 150;
          this.postForm.style.display = "block";
          this.postForm.style.left = left + "px";
          this.postTitleInput.value = node.title;
          // this.postTitleInput.value = node.title;
        }
      }
      else {
        //this.unitNameInput.value = node.name;

        // this.titleInput.value = node.title;
      }
    };

    editForm.prototype.hide = function (showldUpdateTheNode) {
      if (orgchartnodeid != 0) {
        var node = chart.get(orgchartnodeid);

        var omask = document.getElementById("mask");
        omask.classList.add("d-none");
        omask.classList.remove("d-inline-block");
        if (typeof (node.tags) != 'undefined' && node.tags != null) {       //اگر تگ داشت
          var isDeprtment = node.tags.indexOf("department") != -1;
          if (isDeprtment == true) {          // اگر واحد بود
            if (!unitformvaldation()) {
              chart.remove(orgchartnodeid);
              chart.draw();
            }

            var element = document.getElementById("unitbtncontent");
            if (typeof (element) != 'undefined' && element != null) {

              element.classList.remove("d-none");
              element.classList.add("d-inline-block");
            }
            this.unitForm.style.display = "none";
          }
          else //اگر پست بود
          {
            if (!postformvaldation()) {
              chart.remove(orgchartnodeid);
              chart.draw();
            }

            var element = document.getElementById("postbtncontent");
            if (typeof (element) != 'undefined' && element != null) {

              element.classList.remove("d-none");
              element.classList.add("d-inline-block");
            }
            this.postForm.style.display = "none";
          }
        }



      }

      addisupdate(true);
    };

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

    chart = new OrgChart(document.getElementById("tree"), {
      template: "isla",
      enableDragDrop: true,
      showXScroll: OrgChart.scroll.visible,
      showYScroll: OrgChart.scroll.visible,
      // mouseScrool: OrgChart.action.ctrlZoom,
      mouseScrool: OrgChart.action.none,
      nodeMouseClick: OrgChart.action.none,
      editUI: new editForm(),
      menu: {
        orgunitmode: { text: "نمایش سازمان ها", icon: OrgChart.icon.edit(24, 24, "#7A7A7A"), onClick: unitMode },
        postmode: { text: "نمایش پست ها", icon: OrgChart.icon.edit(24, 24, "#7A7A7A"), onClick: postMode },
        // save: { text: "ذخیره ورژن", icon: OrgChart.icon.add(24, 24, "#7A7A7A"), onClick: saveversen },
        // showversion: { text: "مشاهده ورژن", icon: OrgChart.icon.add(24, 24, "#7A7A7A"), onClick: showversion },
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
            addManager: { text: "افزودن پست", icon: OrgChart.icon.add(24, 24, "#7A7A7A"), onClick: addManager },
            addDepartment: { text: "افزودن واحد", icon: OrgChart.icon.add(24, 24, "#7A7A7A"), onClick: addDepartment },
            remove: { text: "حذف" },
            edit: { text: "ویرایش" },
            details: { text: "جزییات", icon: OrgChart.icon.details(24, 24, "7a7a7a"), onClick: detail },
            // move: { text: "جابجایی", icon: OrgChart.icon.details(24, 24, "7a7a7a"), onClick: postMove },
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
            addManager: { text: "افزودن پست", icon: OrgChart.icon.add(24, 24, "#7A7A7A"), onClick: postaddManager },
            edit: { text: "ویرایش" },
            details: { text: "جزییات", icon: OrgChart.icon.details(24, 24, "7a7a7a"), onClick: detail },
            sentences: { text: "افزودن حکم", icon: OrgChart.icon.details(24, 24, "7a7a7a"), onClick: sentence },
            move: { text: "جابجایی", icon: OrgChart.icon.details(24, 24, "7a7a7a"), onClick: postMove },
            // details: { text: "جزییات" },
            remove: { text: "حذف" },
            pdf: { text: "ذخیره pdf" },
            png: { text: "ذخیره PNG" }
          },
        },
        "root": {
          template: "myTemplate",
          nodeMenu: {
            addDepartment: { text: "افزودن واحد", icon: OrgChart.icon.add(24, 24, "#7A7A7A"), onClick: addDepartment },
          }

        },
      }
    });

    chart.on("added", (sender, id) => {
      addisupdate(false);
      sender.editUI.show(id);
    });


    chart.on('drop', (sender, draggedNodeId, droppedNodeId) => {
      var draggedNode = sender.getNode(draggedNodeId);
      var droppedNode = sender.getNode(droppedNodeId);

      if (typeof (draggedNode.tags) != 'undefined' && draggedNode.tags != null) {       //اگر تگ داشت

        if (draggedNode.tags.indexOf("department") != -1) {

          if (typeof (droppedNode.tags) != 'undefined' && droppedNode.tags != null) {       //اگر تگ داشت

            if (droppedNode.tags.indexOf("department") != -1) {
              var draggedNodeData = sender.get(draggedNode.id);
              draggedNodeData.pid = droppedNodeId;

              var orgunit = <any>{ id: draggedNodeData.id.split('o')[1], parentId: draggedNodeData.pid.split('o')[1], displayName: draggedNodeData.name.split('[')[0].trim(), code: draggedNodeData.name.split('[')[1].trim().split(']')[0] };
              this.orgunitservice.editorg(orgunit).subscribe(res => {

                sender.updateNode(draggedNodeData);
                return true;//اگر یک دپارتمان به دپارتمان دیگر انتقال پیدا کرد
              }, error => {
                this.warningNotify({ detail: error.error.error.message + "\r\n" + error.error.error.details, summary: "اخطار" });
                return false;
              });
            }
          }

        }
        else if (draggedNode.tags.indexOf("post") != -1) {
          if (typeof (droppedNode.tags) != 'undefined' && droppedNode.tags != null) {       //اگر تگ داشت

            if (droppedNode.tags.indexOf("post") != -1) {
              var draggedNodeData = sender.get(draggedNode.id);
              var droppedData = sender.get(droppedNode.id);
              draggedNodeData.pid = droppedNodeId;
              draggedNodeData.stpid = null;
              draggedNodeData.orgid = droppedData.orgid;
              var post = <any>{ id: draggedNodeData.id, parentId: draggedNodeData.pid, name: draggedNodeData.title, directManage: null, organizationUnitId: droppedData.stpid };


              this.postService.editPost(post).subscribe(res => {

                sender.updateNode(draggedNodeData);
                return true
              },
                error => {
                  this.warningNotify({ detail: error.error.error.message + "\r\n" + error.error.error.details, summary: "اخطار" });
                  return false
                });


            }
          }
        }
      }
      return false;
      // if (droppedNode.tags.indexOf("department") != -1 && draggedNode.tags.indexOf("department") == -1) {
      //   var draggedNodeData = sender.get(draggedNode.id);
      //   draggedNodeData.pid = null;
      //   draggedNodeData.stpid = droppedNode.id;
      //   sender.updateNode(draggedNodeData);
      //   return false;
      // }
    });


    chart.on('remove', (sender, nodeId) => {

      var node = chart.get(nodeId);
      if (typeof (node.tags) != 'undefined' && node.tags != null) {       //اگر تگ داشت
        var isDeprtment = node.tags.indexOf("department") != -1;

        if (isDeprtment == true) {
          this.orgunitservice.deleteorg(nodeId.split('o')[1]).subscribe(res => {
            this.successNotify({ detail: "حذف با موفقیت انجام شد", summary: "عملیات موفق" });

            removechilder(nodeId);
            chart.draw();
          }, error => {
            this.warningNotify({ detail: error.error.error.message + "\r\n" + error.error.error.details, summary: "اخطار" });
            return false;
          });
        }
        else {
          this.postService.deletePost(nodeId.split('p')[1]).subscribe(res => {
            this.successNotify({ detail: "حذف با موفقیت انجام شد", summary: "عملیات موفق" });
            removechilder(nodeId);
            chart.draw();
          }, error => {
            this.warningNotify({ detail: error.error.error.message + "\r\n" + error.error.error.details, summary: "اخطار" });
            return false;
          })
        }
      }

    });

    var sclicktimeout = null;
    chart.on('click', (sender, node) => {

      clearTimeout(sclicktimeout);
      sclicktimeout = setTimeout(() => {
        var tempnode = chart.get(node.node.id);
        if (typeof (tempnode.tags) != 'undefined' && tempnode.tags != null) {       //اگر تگ داشت
          var isDeprtment = tempnode.tags.indexOf("department") != -1;

          if (isDeprtment == true) {
            this.orgUnitIdout.emit(node.node.id.split('o')[1]);
          }
        }
      }, 400);


    });


    chart.on('dbclick', (sender, node) => {
      clearTimeout(sclicktimeout);
      var tempnode = chart.get(node.id);
      if (typeof (tempnode.tags) != 'undefined' && tempnode.tags != null) {       //اگر تگ داشت
        var isDeprtment = tempnode.tags.indexOf("department") != -1;

        if (isDeprtment == true) {
          this.dblorgUnitId.emit(node.id.split('o')[1]);
        }
      }
    });

    function addAssistant(nodeId) {
      var node = chart.getNode(nodeId);
      var data = { id: OrgChart.randomId(), pid: node.stParent.id, tags: ["assistant"] };
      chart.addNode(data);
    }
    function removechilder(id) {
      var childrensid = chart.nodes[id].childrenIds;
      childrensid.forEach(element => {
        removechilder(element);
      });
      chart.remove(id);
    }

    function addDepartment(nodeId) {
      var data = { id: OrgChart.randomId(), pid: nodeId, tags: ["department"] };
      chart.addNode(data);
    }


    function addManager(nodeId) {
      HitxOrgchartComponent.onaddman = true;
      chart.addNode({ id: OrgChart.randomId(), stpid: nodeId, tags: ["post"], orgid: nodeId });

    }


    function postaddManager(nodeId) {
      alert(nodeId);
      HitxOrgchartComponent.onaddman = false;

      var node = chart.get(nodeId);
      chart.addNode({ id: OrgChart.randomId(), pid: nodeId, tags: ["post"], orgid: node.orgid });
    }
    function postMove(nodeId) {

      HitxOrgchartComponent.onmovepost = !HitxOrgchartComponent.onmovepost;
      addnodeid(nodeId);
    }

    function detail(nodeId) {
      HitxOrgchartComponent.ondetail = !HitxOrgchartComponent.ondetail;
      addnodeid(nodeId);
    }
    function sentence(nodeId) {

      HitxOrgchartComponent.onsen = !HitxOrgchartComponent.onsen;
      addnodeid(nodeId);

    }
    function unitMode() {
      HitxOrgchartComponent.onunitmode = !HitxOrgchartComponent.onunitmode;
    }
    function postMode() {
      HitxOrgchartComponent.onpostmode = !HitxOrgchartComponent.onpostmode;
    }
    function saveversen() {
      HitxOrgchartComponent.savehistory = !HitxOrgchartComponent.savehistory;
    }
    function showversion() {
      HitxOrgchartComponent.showVersion = !HitxOrgchartComponent.showVersion;
    }
    // chart.on('add', function (sender, node) {
    //     alert("add");
    //     // your code goes here
    //     // return false; to cancel the operation
    // });
    // chart.on('update', function (sender, oldNode, newNode) {
    //     alert("uppp")
    //     // your code goes here
    //     // return false; to cancel the operation
    // });
    // chart.on('remove', function (sender, nodeId) {
    //     alert("remove");
    //     // return false;
    //     // your code goes here
    //     // return false; to cancel the operation
    // });












    // this.chart = getchart();
    // this.chart.on('remove', (sender, nodeId) => {
    //   this.orgunitservice.deleteorg(nodeId).subscribe(res => {
    //     this.showSuccess("حذف با موفقیت انجام شد");
    //   }, error => {
    //     this.showWarn(error.error.error.message + "\r\n" + error.error.error.details);
    //     return false;
    //   })
    // });
    addChart(chart);
    this.loadData();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.orgUnitId && this.orgUnitId != undefined)
      this.loadData(this.orgUnitId);
  }
  loadData(orgUnitId?: string): void {
    var chart = getchart();
    this.userservice.getAllUser(<Pagination>{ page: 0, size: 100000, sort: ["login,asc"] }).subscribe(res => {
      this.users = res.map(x => this.userservice.extendUser(x));
    })
    if (!orgUnitId) {
      this.orgunitservice.getAllOrgUnit().subscribe(res => {

        var ff = res.map(x => <any>{ id: "o" + x.id, pid: x.parentId != null ? "o" + x.parentId : null, name: x.parentId != null ? x.displayName + " [" + x.code + "]" : x.displayName, tags: x.parentId != null ? ["department"] : ["root"] });
        this.postService.getAllPost().subscribe(posts => {
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
            ff.push(<any>{
              id: "p" + post.id, stpid: post.parentId == null ? "o" + post.organizationUnitId : null, pid: post.parentId != null ? "p" + post.parentId : null, title: post.name, tags: post.postLayout.toString().toLocaleLowerCase() === PostLayout[PostLayout.left].toLocaleLowerCase() ? ["post", "assistant"] : ["post"],
              name: post.appointments.length > 0 ? post.appointments[post.appointments.length - 1].person.firstName + " " + post.appointments[post.appointments.length - 1].person.lastName : "",
              orgid: "o" + post.organizationUnitId
              // id: post.id, stpid: post.parentId == null ? post.organizationUnitId : null, pid: post.parentId != null ? post.parentId : null, title: post.name, tags:  ["post"],
              // name: "kkkkkk",
              // orgid: post.organizationUnitId
            });
            // }
            // else {

            //   ff.push(<any>{ id: post.id, pid: post.parentId, title: post.name, tags: ["post"],
            //   name:post.sentences.length>0? post.sentences[post.sentences.length-1].person.name +" "+post.sentences[post.sentences.length-1].person.lastName:"" });
            // }
            // }
          });

          chart.load(ff);
          chart.draw();
        });
      }, error => {
        this.handleError(error);

      });
    } else {
      this.orgunitservice.getAllOrgUnit().subscribe(res => {

        // var ff = res.map(x => <any>{ id: x.id, pid: x.parentId != null ? x.parentId : null, name: x.displayName, tags: x.parentId != null ? ["department"] : ["root"] });


        this.postService.getAllPost().subscribe(posts => {
          this.createTreeunit(res, orgUnitId, orgUnitId);
          this.createTreePost(posts, this.orgunittree, orgUnitId, null)
          chart.load(this.orgunittree);
          chart.draw();
          // chart.load(ff);
          // chart.draw();
        });
      }, error => {
        this.handleError(error);
      });
    }

  }
  postModeLoadData() {
    var chart = getchart();
    this.userservice.getAllUser(<Pagination>{ page: 0, size: 100000, sort: ["login,asc"] }).subscribe(res => {
      this.users = res.map(x => this.userservice.extendUser(x));
    });
    this.postService.getAllPost().subscribe(posts => {

      this.postModData = <any>{};
      var pos = <any>[]
      posts.forEach(post => {
        var parent = null;
        if (post.parentId != null) {
          parent = post.parentId;
        } else if (post.directManage != null) {
          parent = post.directManage;
        }
        pos.push(<any>{
          id: "p" + post.id, pid: "p" + parent, title: post.name, tags: post.postLayout == PostLayout.left ? ["post", "assistant"] : ["post"],
          name: post.appointments.length > 0 ? post.appointments[post.appointments.length - 1].person.firstName + " " + post.appointments[post.appointments.length - 1].person.lastName : "",
          orgid: "o" + post.organizationUnitId
        });
      });

      chart.load(pos);
      chart.draw();
    });
  }

  createTreeunit(orgunits: Orgunit[], parent: string, first: string = null) {
    if (first) {
      this.orgunittree = [];
      var children = orgunits.filter(x => x.id == +first);
      children.forEach(org => {
        var newNode = this.getNewNodeunit(org);
        this.orgunittree = [...this.orgunittree, newNode];
        this.createTreeunit(orgunits, newNode.id);
      });
    } else {
      var kkk = +parent.split('o')[1];
      var children = orgunits.filter(x => x.parentId == +parent.split('o')[1]);
      children.forEach(org => {
        var newNode = this.getNewNodeunit(org);
        this.orgunittree.push(newNode);
        this.createTreeunit(orgunits, newNode.id);
      });
    }
  }

  getNewNodeunit(x: Orgunit) {
    return <any>{ id: "o" + x.id, pid: x.parentId != null ? "o" + x.parentId : null, name: x.displayName, tags: x.parentId != null ? ["department"] : ["root"] };
  }

  createTreePost(posts: Post[], chart: any[], parent: string, first: number = null) {
    if (first) {
      var children = posts.filter(x => x.id == first);
      children.forEach(post => {
        var newNode = this.getNewNodePost(post);
        this.orgunittree.push(newNode);
        this.createTreePost(posts, this.orgunittree, newNode.id);
      });
    } else {
      for (let i = 0; i < chart.length; i++) {

        var children1 = posts.filter(x => x.parentId == chart[i].id);
        children1.forEach(post => {
          var newNode = this.getNewNodePost(post);
          this.orgunittree.push(newNode);
          posts = posts.filter(a => a.id != post.id);
          i = 0;
        });
        var children2 = posts.filter(x => x.organizationUnitId == +chart[i].id.split('o')[1]);
        children2.forEach(post => {
          var newNode = this.getNewNodePost(post);
          this.orgunittree.push(newNode);
          posts = posts.filter(a => a.id != post.id);
          i = 0;
        });
      };

    }
  }

  getNewNodePost(post: Post) {
    return <any>{
      id: "p" + post.id, stpid: post.parentId == null ? "o" + post.organizationUnitId : null, pid: post.parentId != null ? "p" + post.parentId : null, title: post.name, tags: post.postLayout == PostLayout.left ? ["post", "assistant"] : ["post"],
      name: post.appointments.length > 0 ? post.appointments[post.appointments.length - 1].person.firstName + " " + post.appointments[post.appointments.length - 1].person.lastName : "",
      orgid: "o" + post.organizationUnitId
    };
  }

  onAddManager(): void {
    if (HitxOrgchartComponent.onaddman == true) {
      this.postService.getAllPost().subscribe(post => {
        this.posts = post;
      }, error => {
        this.handleError(error);
      });
    } else {

    }
  }
  onDetail(): void {
    var id = getId();
    var chart = getchart();

    var node = chart.get(id);
    if (typeof (node.tags) != 'undefined' && node.tags != null) {       //اگر تگ داشت
      var isDeprtment = node.tags.indexOf("department") != -1;

      if (isDeprtment == true) {


        this.ref = this.dialogService.open(OrgunitChartDetailComponent, {
          header: 'مشاهده',
          data: { id: id.split('o')[1] }
          ,
          width: '50%',
          contentStyle: { "max-height": "350px", "overflow": "auto" }
        });

        this.ref.onClose.subscribe((car: string) => {
          if (car) {
            // this.messageService.add({severity:'info', summary: 'Car Selected', detail:'Vin:' + car.vin});
          }
        });
      }
      else {

        this.ref = this.dialogService.open(PostDetailComponent, {
          header: 'مشاهده',
          data: { id: id.split('p')[1] },
          width: '70%',
          contentStyle: { "max-height": "350px", "overflow": "auto" }
        });

        this.ref.onClose.subscribe((car: string) => {
          if (car) {
            // this.messageService.add({severity:'info', summary: 'Car Selected', detail:'Vin:' + car.vin});
          }
        });
      }
    }
  }

  onSentence() {
    var id = getId();
    var chart = getchart();
    var node = chart.get(id);
    this.ref = this.dialogService.open(SentenceCreateComponent, {
      header: 'مشاهده',
      data: { id: id.split('p')[1] }
      ,
      width: '50%',
      height: '400px',
      contentStyle: { "max-height": "350px", "overflow": "auto" }
    });

    this.ref.onClose.subscribe((person: PersonExtended) => {
      if (person) {
        node.name = person.fullName;
        chart.updateNode(node);
        chart.draw();
        // this.messageService.add({severity:'info', summary: 'Car Selected', detail:'Vin:' + car.vin});
      }
    });
  }
  onSaveHistory() {
    this.chartService.createChart().subscribe(res => {
      this.successNotify()
      // this.messageService.add({ key: 'tl', severity: 'success', summary: "عملیات موفق", detail: "عملیات با موفقیت انجام شد." });
    }, error => {
      this.handleError(error);
    });
  }

  onShowVersoin() {
    var id = getId();
    var chart = getchart();
    var node = chart.get(id);
    this.ref = this.dialogService.open(ChartVersionComponent, {
      header: 'مشاهده',
      width: '100%',
      height: '650px',
      contentStyle: { "overflow": "auto" }
    });

    this.ref.onClose.subscribe((person: PersonExtended) => {

    });
  }
  ngOnDestroy() {
    if (this.ref)
      this.ref.close();
  }
  unitSubmit() {
    if (unitformvaldation()) {
      var isupdate = getisupdate();
      if (isupdate) {
        var orgunit = <OrgunitCreate>getUnitEditData();
        this.orgunitservice.editorg(orgunit).subscribe(res => {

          addOrgToChart("");
          this.successNotify({ detail: "با موفقیت ویرایش شد", summary: "عملیات موفق" });
        },
          error => {
            this.warningNotify({ detail: error.error.error.message + "\r\n" + error.error.error.details, summary: "اخطار" });
            var idd = getNodeId();
            var chartt = getchart();
            chartt.remove(idd);
            chartt.draw();
          });
      }
      else {
        var orgunit = <OrgunitCreate>getUnitCreateData();
        orgunit.parentId = +orgunit.parentId.toString().split('o')[1];
        var nodepid = getparenid();
        var nodstpid = getorgparentid();
        this.orgunitservice.createOrg(orgunit).subscribe(res => {

          addOrgToChart('o' + res.id);
          this.successNotify({ detail: "با موفقیت ثبت شد", summary: "عملیات موفق" });
        }, error => {
          this.warningNotify({ detail: error.error.error.message + "\r\n" + error.error.error.details, summary: "اخطار" });
          var idd = getNodeId();
          var chartt = getchart();
          chartt.hide();
          chartt.remove(idd);
          chartt.draw();
        });
      }
    }
    else {
      this.warningNotify({ detail: "اطلاعات را به درستی وارد نمایید.", summary: "اخطار" });
    }
  }


  postSubmit() {
    if (postformvaldation() && this.postLayouTemp && this.postStatusTemp && this.postTypeTemp) {
      var isupdate = getisupdate();
      if (!isupdate) {
        this.postCreateTemp = <PostCreate>getPostCreateData();
        var org = getorgparentid();
        this.postCreateTemp.organizationUnitId = org.split('o')[1];
        var pid = getparenid();
        if (pid) {
          this.postCreateTemp.parentId = pid.split('p')[1];
        } else if (this.dirmanger) {
          this.postCreateTemp.directManage = this.dirmanger;
        }
        this.postCreateTemp.postLayout = PostLayout[this.postLayouTemp].toUpperCase();
        this.postCreateTemp.postStatuse = PostStatuse[this.postStatusTemp].toUpperCase();
        this.postCreateTemp.postType = PostType[this.postTypeTemp].toUpperCase();
        this.postService.createPost(this.postCreateTemp).subscribe(res => {

          res.directManage = res.directManage != null ? 'p' + res.directManage : null;
          res.id = 'p' + res.id;
          res.organizationUnitId = 'o' + res.organizationUnitId;
          res.parentId = res.parentId != null ? 'p' + res.parentId : null;
          res.orgid = res.organizationUnitId;
          addposttochart(res.id, res.organizationUnitId, res.parentId, res.orgid, res.postLayout);
          this.successNotify({ detail: "با موفقیت ذخیره شد", summary: "عملیات موفق" });
        }, error => {
          this.warningNotify({ detail: error.error.error.message + "\r\n" + error.error.error.details, summary: "اخطار" });
          var idd = getNodeId();
          var chartt = getchart();
          chartt.remove(idd);
          chartt.draw();
        });
      }
      else {

        this.postEditTemp = <PostEdit>getPostEditData();

        var org = getorgparentid();
        this.postEditTemp.organizationUnitId = org.split('o')[1];
        // alert(this.postEditTemp.organizationUnitId);
        var pid = getparenid();
        if (pid) {
          this.postEditTemp.parentId = pid.split('p')[1];
        } else if (this.dirmanger) {
          this.postEditTemp.directManage = this.dirmanger.split('p')[1];
        }
        this.postEditTemp.id = +this.postEditTemp.id.toString().split('p')[1];
        this.postEditTemp.postLayout = PostLayout[this.postLayouTemp].toUpperCase();
        this.postEditTemp.postStatuse = PostStatuse[this.postStatusTemp].toUpperCase();
        this.postEditTemp.postType = PostType[this.postTypeTemp].toUpperCase();
        this.postService.editPost(this.postEditTemp).subscribe(res => {

          res.directManage = res.directManage != null ? 'p' + res.directManage : null;
          res.id = 'p' + res.id;
          res.organizationUnitId = 'o' + res.organizationUnitId;
          res.parentId = res.parentId != null ? 'p' + res.parentId : null;
          res.orgid = res.organizationUnitId;
          addposttochart("", res.organizationUnitId, res.parentId, res.orgid, res.postLayout);

          // addposttochart("", this.postCreateTemp.postLayout);
          this.successNotify({ detail: "با موفقیت ویرایش شد", summary: "عملیات موفق" });
        },
          error => {
            this.warningNotify({ detail: error.error.error.message + "\r\n" + error.error.error.details, summary: "اخطار" });
          });
      }


    }
    else {
      this.warningNotify({ detail: "اطلاعات را به درستی وارد نمایید.", summary: "اخطار" });
    }
  }
  onPostMove() {
    var id = getId();
    var chart = getchart();

    var node = chart.get(id);
    if (typeof (node.tags) != 'undefined' && node.tags != null) {       //اگر تگ داشت
      var isDeprtment = node.tags.indexOf("department") != -1;

      if (isDeprtment == true) {


        this.ref = this.dialogService.open(OrgunitMoveComponent, {

          header: 'مشاهده',
          data: { id: id },
          width: '50%',
          contentStyle: { "max-height": "350px", "overflow": "auto" }
        });

        this.ref.onClose.subscribe((res: any) => {
          if (res.action == "cutOrg") {
            node.pid = res.parentId;
            chart.update(node);
            chart.draw();
          }
        });
      }
      else {

        this.ref = this.dialogService.open(PostMoveComponent, {
          header: 'مشاهده',
          data: { id: id.split('p')[1], orgId: node.stpid },
          width: '50%',
          contentStyle: { "max-height": "350px", "overflow": "auto" }
        });

        this.ref.onClose.subscribe((res: any) => {
          if (res.action == "cutPost") {
            node.pid = 'p' + res.parentId;
            node.orgid = 'o' + res.orgid;
            chart.update(node);
            chart.draw();
          }
          else if (res.action == "copyPost") {
            var i = 0;
            res.ids.forEach(id => {
              var data = { id: "p" + id, pid: "p" + res.parentsId[i], name: node.name, title: node.title, tags: ["post"], orgid: "o" + res.orgsid[i] };
              chart.add(data);
              chart.draw();
              i++;
            });
          }
        });
      }
    }
  }
  handleError(error: any) {
    window.alert("error");
  }

}
