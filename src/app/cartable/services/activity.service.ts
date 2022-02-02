import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppFile } from 'src/app/app-file-manager/app-file.model';
import { Pagination, PaginationResponce } from 'src/app/app-shared/base/pagination.model';
import { ReceiverBase } from 'src/app/user/user.model';
import { UserService } from 'src/app/user/user.service';
import { BaseService } from '../../app-shared/base/base.service';
import { ActivityBase, ActivityHistory, ActivitySend, ActivityView } from '../models/activity.model';
import { ActivityArchive, ActivityMove, ActivityRestore, ActivityTrash, Folder, FolderMove, FolderNew, FolderRename } from '../models/folder.model';

@Injectable({
    providedIn: 'root',
})

export class ActivityService extends BaseService {

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private userService: UserService,
        private http: HttpClient) {
        super();
    }

    activitiesListChartView = false;

    IsItRead(activity: ActivityBase): boolean {

        var curUserId = this.userService.curUser?.id;

        if (activity.sender.userId == curUserId) {
            return true;
        }

        var reseiver: ReceiverBase[];

        reseiver = activity.receivers?.filter(a => a.userId == curUserId);
        if (reseiver?.length > 0) {
            if (reseiver[0].viewTime) {
                return true;
            }
        }

        reseiver = activity.receiverCCs?.filter(a => a.userId == curUserId);
        if (reseiver?.length > 0) {
            if (reseiver[0].viewTime) {
                return true;
            }
        }

        reseiver = activity.receiverBCCs?.filter(a => a.userId == curUserId);
        if (reseiver?.length > 0) {
            if (reseiver[0].viewTime) {
                return true;
            }
        }

        return false;
    }

    getActivities(folderId: number, pagination: Pagination): Observable<PaginationResponce> {
        let params = new HttpParams()
            .set('page', pagination.page.toString())
            .set('size', pagination.size.toString());
            pagination.sort.forEach(sort => {
                params = params.append('sort', sort);
              });

        var url = this.apiUrl + "/services/cartable/api/activities-by-folderId/" + folderId;
        return this.http.get<PaginationResponce>(url, { params });
    }

    getActivity(id: number): Observable<ActivityView> {
        var url = this.apiUrl + "/services/cartable/api/activities/" + id;
        return this.http.get<ActivityView>(url);
    }

    getActivityHistory(chainIndexGuid: string): Observable<ActivityHistory[]> {
        var url = this.apiUrl + "/services/cartable/api/activity-history/" + chainIndexGuid;
        return this.http.get<ActivityHistory[]>(url);
    }

    sendActivity(input: FormData): Observable<void> {
        const url = this.apiUrl + "/services/cartable/api/send-activity";
        return this.http.post<void>(url, input);
    }

    getFolder(folderName: string): Observable<Folder> {
        var url = this.apiUrl + "/services/cartable/api/folder-by-name/" + folderName;
        return this.http.get<Folder>(url);
    }

    getUnreadCount(): Observable<number> {
        var url = this.apiUrl + "/api/app/activity/unreadCount";
        return this.http.get<number>(url);
    }

    getFile(objectReferenceId: number): Observable<AppFile> {
        var url = this.apiUrl + "/services/cartable/api/file-objs/" + objectReferenceId;
        return this.http.get<AppFile>(url);
    }

    convertTiffToPdf(fileObject: File): Observable<File> {
        var url = this.apiUrl + "/services/cartable/api/file-objs/";
        return this.http.post<File>(url, fileObject);
    }

    moveActivitis(input: ActivityMove): Observable<void> {
        const url = this.apiUrl + "/api/app/folders/activityMove";
        return this.http.post<void>(url, input);
    }

    trashActivitis(input: ActivityTrash): Observable<void> {
        const url = this.apiUrl + "/api/app/folders/activityTrash";
        return this.http.post<void>(url, input);
    }

    archiveActivitis(input: ActivityArchive): Observable<void> {
        const url = this.apiUrl + "/api/app/folders/activityArchive";
        return this.http.post<void>(url, input);
    }

    restoreActivitis(input: ActivityRestore): Observable<void> {
        const url = this.apiUrl + "/api/app/folders/activityRestore";
        return this.http.post<void>(url, input);
    }

    folderNew(input: FolderNew): Observable<void> {
        const url = this.apiUrl + "/api/app/folders/folderNew";
        return this.http.post<void>(url, input);
    }

    folderRename(input: FolderRename): Observable<void> {
        const url = this.apiUrl + "/api/app/folders/rename";
        return this.http.post<void>(url, input);
    }

    folderDelete(id: number): Observable<void> {
        const url = this.apiUrl + "/api/app/folders/" + id
        return this.http.delete<void>(url);
    }

    folderMove(input: FolderMove): Observable<void> {
        const url = this.apiUrl + "/api/app/folders/move";
        return this.http.post<void>(url, input);
    }



    activitySend: ActivitySend;

    send(activity: ActivitySend): Observable<void> {

        var formData: FormData = new FormData();

        activity.attachments.forEach(obj => {
            if (obj.objectType == "File" && obj.objectId == null)
                formData.append('files', obj.object, obj.name);
        });

        activity.attachments = activity.attachments.filter(obj => !(obj.objectType == "File" && obj.objectId == null));

        //formData.append("activity", JSON.stringify(activity))

        formData.append("activity", new Blob([JSON.stringify(activity)], { type: 'application/json' }));

        return this.sendActivity(formData);
    }

    sendForm(activity: ActivitySend) {

        this.activitySend = activity;
        this.router.navigate(["cartable/send/"]);
    }

}