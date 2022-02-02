import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { Post, PostCopy } from '../post.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-move',
  templateUrl: './post-move.component.html',
  styleUrls: ['./post-move.component.scss']
})
export class PostMoveComponent extends BaseComponent implements OnInit {
  posts: Post[];
  postsSelected: Post[]
  copy: boolean;
  postId: number;
  orgId: string;
  parentsId: number[];
  orgssId: number[];
  postName: string;
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private postservice: PostService) { super(); }

  ngOnInit(): void {
    this.postId = this.config.data.id;
    this.orgId = this.config.data.orgId;
    this.loadData(this.config.data.id);
  }
  loadData(id: number) {
    this.postservice.getPost(this.postId).subscribe(post => {
      this.postName = post.name;
      this.postservice.getAllPost().subscribe(res => {

        if (res) {
          this.posts = res.filter(a => a.id != id && a.id != post.parentId);
        }

      }, error => {
        this.handleError(error);
      });
    })

  }
  onSubmit() {
    if (!this.postsSelected || this.postsSelected.length == 0) {
      // this.notifyWarn("پست مورد نظر را انتخاب کنید" ,"اخطار")
      //this.messageService.add({ key: 'tl', severity: 'warn', summary: "اخطار", detail: "پست مورد نظر را انتخاب کنید" });
    }
    else {
      if (this.postsSelected.length > 1 && this.copy == false) {
        // this.notifyWarn("برای انتقال فقط یک پست را میتوانید انتخاب کنید","اخطار")
      //  this.messageService.add({ key: 'tl', severity: 'warn', summary: "اخطار", detail: "برای انتقال فقط یک پست را میتوانید انتخاب کنید" });
      }

      else if (this.copy == true) {/////////////// کپی کردن
        this.parentsId = [];
        this.orgssId = [];
        this.postsSelected.forEach(element => {
          this.parentsId.push(element.id);
          this.orgssId.push(element.organizationUnitId);
        });
        var post1 = <PostCopy>{ id: this.postId, parentIds: this.parentsId, organizationUnitIds: this.orgssId };
        this.postservice.copyPost(post1).subscribe(res => {
        //  this.notifySuccess("با موفقیت ویرایش شد","عملیات موفق")
         // this.messageService.add({ key: 'tl', severity: 'success', summary: "عملیات موفق", detail: "با موفقیت ویرایش شد" });
          var result = <any>{ action: "copyPost", parentsId: this.parentsId, ids: res, orgsid: this.orgssId }
          this.ref.close(result);
        },
          error => {
            // this.notifyWarn( error.error.error.message + "\r\n" + error.error.error.details,"اخطار")
            //this.messageService.add({ key: 'tl', severity: 'warn', summary: "اخطار", detail: error.error.error.message + "\r\n" + error.error.error.details });
          });
      }
      else {///////////////// انتقال دادن
        var post = <Post>{ id: this.postId, name: this.postName, parentId: this.postsSelected[0].id, organizationUnitId: this.postsSelected[0].organizationUnitId };
        post.id = +post.id;
        this.postservice.editPost(post).subscribe(res => {
        //  this.notifySuccess("با موفقیت ویرایش شد","عملیات موفق")
          //this.messageService.add({ key: 'tl', severity: 'success', summary: "عملیات موفق", detail: "با موفقیت ویرایش شد" });
          var result = <any>{ action: "cutPost", parentId: this.postsSelected[0].id, orgid: this.postsSelected[0].organizationUnitId }
          this.ref.close(result);
        },
          error => {
            // this.notifyWarn( error.error.error.message + "\r\n" + error.error.error.details,"اخطار")

            //this.messageService.add({ key: 'tl', severity: 'warn', summary: "اخطار", detail: error.error.error.message + "\r\n" + error.error.error.details });
          });
      }
    }
  }
  handleError(error: any) {
    throw new Error("Method not implemented.");
  }
}
