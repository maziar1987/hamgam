import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { PostService } from '../post.service';
import { Post, PostStatuse, PostLayout, PostType } from '../post.model';
import { SentenceType } from '../sentence.model';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit {

  post: Post;
  postStatuses=PostStatuse;
  postLayouts=PostLayout;
  postTypes=PostType;
  sentenceTypes=SentenceType;
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private postservice: PostService) { }

  ngOnInit(): void {
    this.loadData(this.config.data.id);
  }
  loadData(id: number) {
    this.postservice.getPost(id).subscribe(res => {

      if (res) {
        this.post = res;
      }

    }, error => {
      this.handleError(error);
    });
  }
  handleError(error: any) {
    throw new Error("Method not implemented.");
  }
}
