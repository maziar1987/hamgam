import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/app-shared/base/base.service';
import { TreeNode } from 'primeng/api/treenode';
import { Post, PostCopy, PostCreate, PostEdit } from './post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService extends BaseService {
  
  constructor(
    private http: HttpClient) {
    super();
  }

  // getChildOrgUnits(id: string): Observable<OrgunitCreate[]> {
  //   var url = this.apiUrl + "/api/app/orgUnit/" + id + "/children";
  //   return this.http.get<OrgunitCreate[]>(url);
  // }
  getPost(id: number): Observable<Post> {
    var url = this.apiUrl + "/services/basicinfo/api/posts/" + id;
    return this.http.get<Post>(url);
  }
  // getOrgUnitWithDetails(id: string): Observable<Orgunit> {
  //   var url = this.apiUrl + "/api/app/orgUnit/" + id;
  //   return this.http.get<Orgunit>(url);
  // }
  // getOrgUnitByName(name: string): Observable<OrgunitCreate> {
  //   var url = this.apiUrl + "/api/app/orgUnit/byName?name=" + name;
  //   return this.http.get<OrgunitCreate>(url);
  // }
  getAllPost(): Observable<Post[]> {
    var url = this.apiUrl + "/services/basicinfo/api/posts";
    return this.http.get<Post[]>(url);
   }
   getByOrguniId(orgid:string): Observable<Post[]> {
    var url = this.apiUrl + "/services/basicinfo/api/posts/get-by-org-uni-id/"+orgid;
    return this.http.get<Post[]>(url);
   }
  createPost(post:PostCreate): Observable<any> {
    var url = this.apiUrl + "/services/basicinfo/api/posts";
    return this.http.post<any>(url,post);
  }
  
editPost(org: PostEdit): Observable<any> {
    var url = this.apiUrl + "/services/basicinfo/api/posts";
    return this.http.put<any>(url, org);
  }
  
copyPost(org: PostCopy): Observable<number[]> {
  var url = this.apiUrl + "/services/basicinfo/api/posts/copy-post";
  return this.http.post<number[]>(url, org);
}
  deletePost(postid: string): Observable<Object> {
    var url = this.apiUrl + "/services/basicinfo/api/posts/" + postid;
    return this.http.delete(url);
  }
}
