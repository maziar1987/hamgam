// this.saveButton.addEventListener("click", function () {
//     //console.warn("ffffffffffffffffffffffffff",that);
//     // var node = chart.get(that.nodeId);
//     // var nametemp = that.nameInput.value;
//     // var titletemp = that.titleInput.value;
//     // // alert(nametemp+"   "+titletemp);
//     // if ((typeof (nametemp) != 'undefined' && typeof (titletemp) != 'undefined') &&
//     //     (nametemp != 'undefined' &&titletemp != 'undefined') &&
//     //     (nametemp.trim() != '' && titletemp.trim() != '')) {
//     //     node.name = nametemp;
//     //     node.title = titletemp;
//     //     chart.updateNode(node);
//     //     that.hide();
//     // }
//     // else {
//     //     alert("اطلاعات را به درستی وارد نمایید");
//     // }
// });

// var that;
// var chart;
// var orgchartnodeid = 0;
// var publicnode;
// var nodeparentid;
// var nodeorgparentid;
// var isupdate = true;
// function getchart() {

//     function editForm() {
//         this.nodeId = null;
//     };

//     editForm.prototype.init = function (obj) {
//         that = this;
//         this.obj = obj;
//         this.unitForm = document.getElementById("unitForm");
//         this.unitNameInput = document.getElementById("unitName");
//         this.unitCancelButton = document.getElementById("unitCancel");
//         this.unitSaveButton = document.getElementById("unitSave");


//         this.postForm = document.getElementById("postForm");
//         this.postNameInput = document.getElementById("postName");
//         this.postTitleInput = document.getElementById("postTitle");
//         this.postCancelButton = document.getElementById("postCancel");
//         this.postSaveButton = document.getElementById("postSave");


//     };


//     editForm.prototype.show = function (nodeId, isdetail) {
//         that = this;
//         orgchartnodeid = nodeId;
//         publicnode = chart.get(nodeId);
//         if (typeof (publicnode.pid) != 'undefined' && publicnode.pid != null) {
//             nodeparentid = publicnode.pid;
//         }
//         else {
//             nodeorgparentid = publicnode.stpid;
//         }
//         this.unitForm = document.getElementById("unitForm");
//         this.unitNameInput = document.getElementById("unitName");
//         // this.titleInput = document.getElementById("title");
//         this.unitCancelButton = document.getElementById("unitCancel");
//         this.unitSaveButton = document.getElementById("unitSave");
//         this.unitCancelButton.addEventListener("click", function () {
//             that.hide();
//         });


//         this.postForm = document.getElementById("postForm");
//         this.postNameInput = document.getElementById("postName");
//         this.postTitleInput = document.getElementById("postTitle");
//         this.postCancelButton = document.getElementById("postCancel");
//         this.postSaveButton = document.getElementById("postSave");
//         this.postCancelButton.addEventListener("click", function () {
//             that.hide();
//         });


//         var node = chart.get(nodeId);
//         this.nodeId = nodeId;
//         if (typeof (node.tags) != 'undefined' && node.tags != null) {       //اگر تگ داشت
//             var isDeprtment = node.tags.indexOf("department") != -1;

//             if (isDeprtment == true) {          // اگر واحد بود

//                 if (typeof (isdetail) != 'undefined') { //اگر فرم در حالت جزییات باز شده بود باید دکمه های  فرم حذف شود

//                     var myobj = document.getElementById("unitbtncontent");
//                     myobj.classList.remove("d-inline-block");
//                     myobj.classList.add("d-none");

//                 }
//                 var left = document.body.offsetWidth / 2 - 150;
//                 this.unitForm.style.display = "block";
//                 this.unitForm.style.left = left + "px";
//                 this.unitNameInput.value = node.name;
//             }
//             else {//اگر پست بود

//       if (typeof (isdetail) != 'undefined') { //اگر فرم در حالت جزییات باز شده بود باید دکمه های  فرم حذف شود

//                     var myobj = document.getElementById("postbtncontent");
//                     myobj.classList.remove("d-inline-block");
//                     myobj.classList.add("d-none");

//                 }

//                 alert(4);
//                 var left = document.body.offsetWidth / 2 - 150;
//                 this.postForm.style.display = "block";
//                 this.postForm.style.left = left + "px";
//                 this.postNameInput.value = node.name;

//                 this.postNameInput.value = node.name;

//                 this.postTitleInput.value = node.title;
//             }
//         }
//         else {

//             //this.unitNameInput.value = node.name;

//             // this.titleInput.value = node.title;
//         }
//     };

//     editForm.prototype.hide = function (showldUpdateTheNode) {
//         if (orgchartnodeid != 0) {
//             var node = chart.get(orgchartnodeid);

//             if (typeof (node.tags) != 'undefined' && node.tags != null) {       //اگر تگ داشت
//                 var isDeprtment = node.tags.indexOf("department") != -1;


//                 if (isDeprtment == true) {          // اگر واحد بود

//                     if (!unitformvaldation()) {
//                         chart.remove(orgchartnodeid);
//                         chart.draw();
//                     }

//                     var element = document.getElementById("unitbtncontent");
//                     if (typeof (element) != 'undefined' && element != null) {

//                         element.classList.remove("d-none");
//                         element.classList.add("d-inline-block");
//                     }
//                     this.unitForm.style.display = "none";
//                 }
//                 else //اگر پست بود
//                 {
//                     if (!postformvaldation()) {
//                         chart.remove(orgchartnodeid);
//                         chart.draw();
//                     }

//                     var element = document.getElementById("postbtncontent");
//                     if (typeof (element) != 'undefined' && element != null) {

//                         element.classList.remove("d-none");
//                         element.classList.add("d-inline-block");
//                     }
//                     this.postForm.style.display = "none";
//                 }
//             }



//         }
//     };

//     chart = new OrgChart(document.getElementById("tree"), {
//         template: "isla",
//         enableDragDrop: true,
//         //detailsUI: new detailsForm(),
//         // details:new deatalform(), 
//         showXScroll: OrgChart.scroll.visible,
//         showYScroll: OrgChart.scroll.visible,
//         mouseScrool: OrgChart.action.ctrlZoom,
//         mouseScrool: OrgChart.action.none,
//         editUI: new editForm(),
//         // menu: {

//         //     pdf: { text: "ذخیره pdf" },
//         //     png: { text: "ذخیره PNG" }
//         // },
//         nodeMenu: {
//             // add: { text: "افزودن پست" },
//             // // addAssistant: { text: "افزودن جانشین", icon: OrgChart.icon.add(24, 24, "#7A7A7A"), onClick: addAssistant },
//             // edit: { text: "ویرایش" },
//             // details: { text: "جزییات" },
//             // remove: { text: "حذف" },
//             // pdf: { text: "ذخیره pdf" },
//             // png: { text: "ذخیره PNG" }
//         },
//         // align: OrgChart.ORIENTATION,
//         toolbar: {
//             fullScreen: true,
//             zoom: true,
//             fit: true,
//             expandAll: true
//         },
//         nodeBinding: {
//             field_0: "name",
//             field_1: "title",
//         },
//         tags: {
//             "department": {
//                 template: "group",
//                 subTreeConfig: {

//                     collapse: {
//                         level: 0
//                     }
//                 },
//                 nodeMenu: {
//                     addManager: { text: "افزودن پست", icon: OrgChart.icon.add(24, 24, "#7A7A7A"), onClick: addManager },
//                     addDepartment: { text: "افزودن واحد", icon: OrgChart.icon.add(24, 24, "#7A7A7A"), onClick: addDepartment },
//                     remove: { text: "حذف" },
//                     edit: { text: "ویرایش" },
//                     pdf: { text: "ذخیره pdf" },
//                     png: { text: "ذخیره PNG" }
//                     // nodePdfPreview: { text: "ذخیره PDF", icon: OrgChart.icon.pdf(24, 24, "#7A7A7A"), onClick: nodePdfPreview }
//                 },
//             },
//             "post": {
//                 template: "isla",

//                 nodeMenu: {
//                     addManager: { text: "افزودن پست", icon: OrgChart.icon.add(24, 24, "#7A7A7A"), onClick: postaddManager },
//                     // addAssistant: { text: "افزودن جانشین", icon: OrgChart.icon.add(24, 24, "#7A7A7A"), onClick: addAssistant },
//                     edit: { text: "ویرایش" },
//                     details: { text: "جزییات" },
//                     remove: { text: "حذف" },
//                     pdf: { text: "ذخیره pdf" },
//                     png: { text: "ذخیره PNG" }
//                 },
//             },
//             "root": {
//                 template: "myTemplate",
//                 nodeMenu: {
//                     addDepartment: { text: "افزودن واحد", icon: OrgChart.icon.add(24, 24, "#7A7A7A"), onClick: addDepartment },
//                 }

//             },
//         }
//     });

//     chart.on("added", (sender, id) => {
//         sender.editUI.show(id);
//         isupdate = false;
//     });

//     chart.on('drop', (sender, draggedNodeId, droppedNodeId) => {
//         var draggedNode = sender.getNode(draggedNodeId);
//         var droppedNode = sender.getNode(droppedNodeId);

//         if (droppedNode.tags.indexOf("department") != -1 && draggedNode.tags.indexOf("department") == -1) {
//             var draggedNodeData = sender.get(draggedNode.id);
//             draggedNodeData.pid = null;
//             draggedNodeData.stpid = droppedNode.id;
//             sender.updateNode(draggedNodeData);
//             return false;
//         }
//     });

//     // chart.on('add', function (sender, node) {
//     //     alert("add");
//     //     // your code goes here 
//     //     // return false; to cancel the operation
//     // });
//     // chart.on('update', function (sender, oldNode, newNode) {
//     //     alert("uppp")
//     //     // your code goes here 
//     //     // return false; to cancel the operation
//     // });
//     // chart.on('remove', function (sender, nodeId) {
//     //     alert("remove");
//     //     // return false;
//     //     // your code goes here 
//     //     // return false; to cancel the operation
//     // });



//     function addAssistant(nodeId) {
//         var node = chart.getNode(nodeId);
//         var data = { id: OrgChart.randomId(), pid: node.stParent.id, tags: ["assistant"] };
//         chart.addNode(data);
//     }


//     function addDepartment(nodeId) {
//         var data = { id: OrgChart.randomId(), pid: nodeId, tags: ["department"] };
//         chart.addNode(data);
//     }

//     function addManager(nodeId) {
//         alert("iiiiiiii");
//         chart.addNode({ id: OrgChart.randomId(), stpid: nodeId ,tags:["post"]});
//     }
// function postaddManager(nodeId){
//     alert("ppppppppppppp");
//     chart.addNode({ id: OrgChart.randomId(), pid: nodeId ,tags:["post"]});
// }
//     return chart;
// }





var that;
var chart;
var orgchartnodeid = 0;
var nodeparentid;
var nodeorgparentid;
var isupdate = true;
var nodid;

function addThat(newthat) {
    that = newthat;

    chart = that.obj;
}
function addChart(newchart) {
    chart = newchart;
}
function addOrgchartnodeid(neworgchartnodeid) {
    orgchartnodeid = neworgchartnodeid;
}
// functio
function addnodeparentid(newnodeparentid) {
    nodeparentid = newnodeparentid;
}
function addnodeorgparentid(newnodeorgparentid) {
    nodeorgparentid = newnodeorgparentid;
}
function addisupdate(newisupdate) {
    isupdate = newisupdate;
}

function addOrgToChart(newid) {
    var node = chart.get(that.nodeId);
    var nametemp = that.unitNameInput.value;
    nametemp+=" ["+that.unitCodeInput.value+"]"
    if ((typeof (nametemp) != 'undefined') &&
        (nametemp != 'undefined') &&
        (nametemp.trim() != '' )) {
        node.name = nametemp;
        chart.updateNode(node);

        that.hide();
        if (newid != "") {
            node.id = newid;
            chart.updateNode(node);
            chart.draw();
        }
        isupdate = true;
    }
    else {
        alert("اطلاعات را به درستی وارد نمایید");
    }
}
function addposttochart(newid,organizationUnitId,parentId,orgid,layout) {
    var node = chart.get(that.nodeId);
    console.warn("mynode",node);
    var nametemp = that.postTitleInput.value;
    if ((typeof (nametemp) != 'undefined' ) &&
        (nametemp != 'undefined' ) &&
        (nametemp.trim() != '')) {
        node.title = nametemp;
        chart.updateNode(node);

        that.hide();
        if (newid != "") {
            node.id = newid;
        }
        if(layout=='LEFT'){
            node.tags=["post","assistant"];
        }
        else{
            node.tags=["post"];
        }
        chart.updateNode(node);
        chart.draw();
        isupdate = true;
    }
    else {
        alert("اطلاعات را به درستی وارد نمایید");
    }
}
function addnodeid(newid){
    nodid=newid;
}
function getparenid() {
    return nodeparentid;
}
function getchart(){
    return chart;
}
function getorgparentid() {
    return nodeorgparentid;
}
function getisupdate() {
    return isupdate;
}
function unitformvaldation() {
    var nametemp = that.unitNameInput.value;
    var codetemp = that.unitCodeInput.value;
    if (typeof (nametemp) != 'undefined' && nametemp != 'undefined' && nametemp.trim() != ''&&
    typeof (codetemp) != 'undefined' && codetemp != 'undefined' && codetemp.trim() != '') {
        return true;
    }
    else {
        return false;
    }
}
function postformvaldation() {
    var nametemp = that.postTitleInput.value;
    // var titletemp = that.postTitleInput.value;
    if ((typeof (nametemp) != 'undefined' && nametemp != 'undefined' && nametemp.trim() != '') /*&&
        (typeof (titletemp) != 'undefined' && titletemp != 'undefined' && titletemp.trim() != '')*/) {
        return true;
    }
    else {
        return false;
    }
}
function getUnitCreateData() {
    return { parentId: nodeparentid, displayName: that.unitNameInput.value,code:that.unitCodeInput.value };
}
function getUnitEditData() {
    return { id: orgchartnodeid, parentId: nodeparentid, displayName: that.unitNameInput.value,code:that.unitCodeInput.value };
}
function getId() {
    return nodid;
    }
    function getNodeId() {
        return that.nodeId;
        }
function getPostCreateData() {
    return {  name: that.postTitleInput.value };
}
function getPostEditData() {
    return { id: orgchartnodeid, name: that.postTitleInput.value };
}
function test(input) {
    alert(input);
}



