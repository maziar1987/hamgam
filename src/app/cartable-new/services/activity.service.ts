import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/app-shared/base/base.service';
import { Pagination, PaginationResponce } from 'src/app/app-shared/base/pagination.model';
import { ExpertPerson } from 'src/app/expert-person/expert-person.model';
import { RegulationsCertificate } from 'src/app/regulations/components/regulations-certificate/regulations-certificate.model';
import { User } from 'src/app/user-management/models/user';
import { Activity, ActivitySend } from '../models';
import { ActivityInput } from '../models/activity-input';
import { StartProcessInstanceBody } from '../models/start-process-instance-body';

@Injectable({
  providedIn: 'root'
})
export class ActivityService extends BaseService {
  //   var url = this.apiUrl + "/services/cartable/api/activities/by-folder-name/";

  constructor(
    private http: HttpClient
  ) {
    super();
  }

  get cols() {
    return [
      { field: 'startActivityId', header: 'startActivityId' },
      { field: 'sender', header: 'sender' },
      { field: 'subject', header: 'subject' },
      // { field: 'text', header: 'text' },
      // { field: 'activityObjectInfo', header: 'activityObjectInfo' },
      { field: 'workflowPersianName', header: 'workflowName' },
      { field: 'workflowStepPersianName', header: 'workflowStep' },
      { field: 'receivers', header: 'receivers' },
      { field: 'creationTime', header: 'creationTime' },
      // { field: 'sendType', header: 'sendType' }
    ];
  }

  getActivitiesByFolderId(folderId: number, pagination: Pagination): Observable<PaginationResponce> {
    pagination.sort = ['creationTime,desc'];
    let params = new HttpParams()
      .set('page', pagination.page.toString())
      .set('size', pagination.size.toString());
    pagination.sort.forEach(sort => {
      params = params.append('sort', sort);
    });

    var url = this.apiUrl + "/services/cartable/api/activities/by-folder-id/";
    return this.http.post<PaginationResponce>(url, <ActivityInput>{ folderId: folderId }, { params });
  }

  getActivitiesByFolderName(folderName: string, pagination: Pagination): Observable<PaginationResponce> {
    pagination.sort = ['creationTime,desc'];
    let params = new HttpParams()
      .set('page', pagination.page.toString())
      .set('size', pagination.size.toString());
    pagination.sort.forEach(sort => {
      params = params.append('sort', sort);
    });

    var url = this.apiUrl + "/services/cartable/api/activities/by-folder-name/";
    return this.http.post<PaginationResponce>(url, <ActivityInput>{ folderName: folderName }, { params });
  }

  getActivity(id: number): Observable<Activity> {
    var url = this.apiUrl + "/services/cartable/api/activities/" + id;
    return this.http.get<Activity>(url);
  }

  getActivityHistory(id: number): Observable<Activity[]> {
    var url = this.apiUrl + "/services/cartable/api/activities/history/" + id;
    return this.http.get<Activity[]>(url);
  }

  getActivityFile(attachmentId: number): Observable<any> {
    var url = this.apiUrl + "/services/cartable/api/file-objects/" + attachmentId;
    return this.http.get<any>(url);
  }

  getUnSeenActivityCount(userId): Observable<number> {
    var url = "/services/cartable/api/activities/count-un-seen/";
    return this.http.post<number>(url, { userId: userId });
  }

  // getByFolderId(folderId: number): Observable<Folder> {
  //   var url = this.apiUrl + "/services/cartable/api/activities/by-folder-id/";
  //   return this.http.post<Folder>(url, { folderId: folderId });
  // }

  // getByFolderName(folderName: string): Observable<Folder> {
  //   var url = this.apiUrl + "/services/cartable/api/activities/by-folder-name/";
  //   return this.http.post<Folder>(url, { folderName: folderName });
  // }

  deleteActivities(activitiesIds: number[]): Observable<any> {
    var url = this.apiUrl + "/services/cartable/api/activities/delete";
    return this.http.post<any>(url, { activitiesIds: activitiesIds });
  }

  restoreActivities(activitiesIds: number[]): Observable<any> {
    var url = this.apiUrl + "/services/cartable/api/activities/restore";
    return this.http.post<any>(url, { activitiesIds: activitiesIds });
  }

  archiveActivities(activitiesIds: number[]): Observable<any> {
    var url = this.apiUrl + "/services/cartable/api/activities/archive";
    return this.http.post<any>(url, { activitiesIds: activitiesIds });
  }

  setAsSeenActivity(id: number): Observable<any> {
    var url = this.apiUrl + "/services/cartable/api/activities/set-as-seen/" + id;
    return this.http.put<any>(url, null);
  }

  startProcess(activity: ActivitySend, startProcessInstanceBody: StartProcessInstanceBody, serviceName: string): Observable<void> {
    var formData: FormData = new FormData();

    activity?.attachments?.forEach(obj => {
      if (obj.objectType == "File" && obj.objectId == null)
        formData.append('files', obj.file, obj.name);
    });

    activity.attachments = activity?.attachments?.filter(obj => !(obj.objectType == "File" && obj.objectId == null));

    formData.append("activity", new Blob([JSON.stringify(activity)], { type: 'application/json' }));
    formData.append("startProcessInstanceBody", new Blob([JSON.stringify(startProcessInstanceBody)], { type: 'application/json' }));
    // formData.append("inputWorkFlowDTO", new Blob([JSON.stringify(<InputWorkFlow>{ processDefinitionKey: serviceName })], { type: 'application/json' }));

    const url = `${this.apiUrl}/services/cartable/api/activities/task-start/${serviceName}`;
    return this.http.post<void>(url, formData);
  }

  completeProcess(activity: ActivitySend, completeTaskBody: StartProcessInstanceBody, activityId: number): Observable<void> {
    var formData: FormData = new FormData();

    activity?.attachments?.forEach(obj => {
      if (obj.objectType == "File" && obj.objectId == null)
        formData.append('files', obj.file, obj.name);
    });

    activity.attachments = activity?.attachments?.filter(obj => !(obj.objectType == "File" && obj.objectId == null));

    formData.append("activity", new Blob([JSON.stringify(activity)], { type: 'application/json' }));
    formData.append("completeTaskBody", new Blob([JSON.stringify(completeTaskBody)], { type: 'application/json' }));


    const url = `${this.apiUrl}/services/cartable/api/activities/task-complete/${activityId}`;
    return this.http.post<void>(url, formData);
  }

  send(activity: ActivitySend, files: File[] | null = null): Observable<void> {
    var formData: FormData = new FormData();

    files?.forEach(file => {
      formData.append('files', file, file.name);
    });

    activity.attachments = activity?.attachments?.filter(obj => !(obj.objectType == "File" && obj.objectId == null));

    formData.append("activity", new Blob([JSON.stringify(activity)], { type: 'application/json' }));

    const url = this.apiUrl + "/services/cartable/api/activities/send-activity";
    return this.http.post<void>(url, formData);
  }

  getLimitedText(activity: Activity): string {
    var s: string = activity.text ? String(activity.text).replace(/<[^>]+>/gm, ' ') : '';
    if (s.length > 100) s = s.substr(0, 100) + " ...";
    return s;
  }

  getSenderFullName(activity: Activity) {
    return `${activity?.sender?.user?.firstName || ''} ${activity?.sender?.user?.lastName || ''}`;
  }

  getReceiversFullName(activity: Activity, checkLength: boolean) {
    var receiversFullName = [];
    activity?.receivers?.forEach(receiver => {
      if (checkLength && receiversFullName.length >= 2) {
        receiversFullName.push('...');
        return receiversFullName.join('، ');
      }
      receiversFullName.push(`${receiver?.user?.firstName || ''} ${receiver?.user?.lastName || ''}`);
    });
    return receiversFullName.join('، ');
  }

  getActivityObjectInfo(activity: Activity) {
    if (activity?.activityObject?.objectType == "ExpertPerson") {
      var expertperson: ExpertPerson = activity.activityObjectInfo;
      if (expertperson) {
        return `${expertperson.firstName} ${expertperson.lastName}`;
      }
    } else if (activity?.activityObject?.objectType == "Certificate") {
      var regulationsCertificate: RegulationsCertificate = activity.activityObjectInfo;
      if (regulationsCertificate) {
        return `${regulationsCertificate.title}`;
      }
    }

    return "";
  }

  isNotSender(activity: Activity, currentUser: User): boolean { return activity?.sender?.user?.id !== currentUser?.id; }

}
