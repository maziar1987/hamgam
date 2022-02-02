import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Post, PostStatuse, PostLayout, PostType } from '../post.model';
import { SentenceType } from '../sentence.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-orguni-posts-detail',
  templateUrl: './orguni-posts-detail.component.html',
  styleUrls: ['./orguni-posts-detail.component.scss']
})
export class OrguniPostsDetailComponent implements OnInit {
  posts: Post[];
  postStatuses=PostStatuse;
  postLayouts=PostLayout;
  postTypes=PostType;
  sentenceTypes=SentenceType;
  @Input() orgUnitId:string;
  
  cols: any[];
  constructor(private postservice: PostService) { }

  ngOnInit(): void {
    this.cols = [
      { field: 'name', header: 'نام پست' },
      { field: 'status', header: 'وضعیت' },
      { field: 'type', header: 'نوع' },
      { field: 'firstName', header: 'نام فرد' },
      { field: 'lastName', header: 'نام خانوادگی' },
      { field: 'startDate', header: 'تاریخ شروع' },
      { field: 'endData', header: 'تاریخ پایان' },
      { field: 'paperNumber', header: 'شماره نامه' },
      { field: 'paperDate', header: 'تاریخ نامه' },
    ];
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.orgUnitId) {

    this.loadData(this.orgUnitId);
    }
  }
  loadData(orgid: string) {
    this.postservice.getByOrguniId(orgid).subscribe(res => {
      if (res) {
        this.posts = res;
      }

    }, error => {
      this.handleError(error);
    });
  }
  handleError(error: any) {
    throw new Error("Method not implemented.");
  }
}
