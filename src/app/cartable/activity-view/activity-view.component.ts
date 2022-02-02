import {Location} from '@angular/common';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {AppFileManagerService} from 'src/app/app-file-manager/app-file-manager.service';
import {BaseComponent} from 'src/app/app-shared/base/base.component';
import {LoggerService} from 'src/app/app-shared/services/logger.service';
import {BasicValueService} from 'src/app/basicinfo/basic-value/basic-value.service';
import {User} from 'src/app/user/user.model';
import {UserService} from 'src/app/user/user.service';
import {ActivityView, ObjectReference, SendType} from '../models/activity.model';
import {ActivityService} from '../services/activity.service';


@Component({
  selector: 'app-activity-view',
  templateUrl: './activity-view.component.html',
  styleUrls: ['./activity-view.component.scss']
})
export class ActivityViewComponent extends BaseComponent implements OnInit {

  activity: ActivityView;
  sendTypeCC: string;
  receiversCCName: string = '';
  receiversName: string = '';
  receiversBCCName: string = '';
  selected: ObjectReference;
  // text: string;
  // subject: string;

  users: User[] = [];

  // attachedObjects: AttachmentObject[];
  // attachedFiles: AttachmentFile[];

  urls: string[] = [];
  surl: string = '';

  sendTypes = SendType;

  constructor(
    private basicValueService: BasicValueService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private logger: LoggerService,
    private activityService: ActivityService,
    private location: Location,
    private sanitizer: DomSanitizer,
    private appFileManagerService: AppFileManagerService
  ) {
    super();

  }

  @ViewChild('textView', {static: true}) textView: ElementRef;

  ngOnInit() {

    var activityId: number = +this.activatedRoute.snapshot.params['id'];
    this.getActivity(activityId);
  }

  getActivity(activityId: number) {
    this.activityService.getActivity(activityId).subscribe(res => {

      this.activity = res;

      this.setActivityBasicValues(this.activity);
      this.setActivityUsers(this.activity);

      if (this.activity.firstView && this.userService.unreadCount > 0) {
        this.userService.unreadCount--;
      }


      this.userService.getCurrentUser().subscribe(r => {

        this.receiversCCName = this.activity.receiverCCs?.map(x => x.user?.firstName + ' ' + x.user?.lastName).join('، ');
        this.receiversName = this.activity.receivers?.map(x => x.user?.firstName + ' ' + x.user?.lastName).join('، ');
        this.receiversBCCName = this.activity.receiverBCCs?.map(x => x.user?.firstName + ' ' + x.user?.lastName).join('، ');
        // if (this.activity.currentUserType == CurrentUserType.ReceiverCC) {
        //   this.sendTypeCC = "رونوشت";
        // }
        // else if (this.activity.currentUserType == CurrentUserType.ReceiverBCC) {
        //   this.sendTypeCC = "رونوشت مخفی";
        // }
        var cc = this.activity.receiverCCs?.filter(a => a.user?.id == r.id);
        if (cc?.length == 0) {
          var bcc = this.activity.receiverBCCs?.filter(a => a.user?.id == r.id);
          if (bcc?.length > 0) {
            this.sendTypeCC = 'رونوشت مخفی';
          }
        }
        if (cc?.length > 0) {
          this.sendTypeCC = 'رونوشت';
        }
        // this.subject = this.activity.subject;
        // this.text = this.activity.text;
        this.textView.nativeElement.innerHTML = this.activity.text;
        // this.attachedObjects = this.activity.attachedObjects;
        // this.attachedFiles = this.activity.attachedFiles;
        // if (this.isNotYours())
        //   this.activityService.view(activityId).subscribe(res => this.userService.unreadCount--);

      });
      // if (this.activity.attachmentsCount > 0) {
      //   this.showFile(this.activity.attachments[0]);
      // }
    });

  }

  setActivityBasicValues(activity: ActivityView) {
    this.basicValueService.getBasicInfo(activity.priorityId).subscribe(res => activity.priority = res);
    this.basicValueService.getBasicInfo(activity.classificationId).subscribe(res => activity.classification = res);
  }

  setActivityUsers(activity: ActivityView) {
    this.userService.getUser(activity.sender.userId).subscribe(user => {
      activity.sender.user = user;
    });

    activity.receivers?.forEach(receiver => {
      this.userService.getUser(receiver.userId).subscribe(res => receiver.user = res);
    });

    activity.receiverCCs?.forEach(receiver => {
      this.userService.getUser(receiver.userId).subscribe(res => receiver.user = res);
    });

    activity.receiverBCCs?.forEach(receiver => {
      this.userService.getUser(receiver.userId).subscribe(res => receiver.user = res);
    });
  }

  clickBack() {
    this.location.back();
  }

  showFile(rowData: ObjectReference) {
    // var url: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.activityService.apiUrl + "/cartable/uploadfiles/" + rowData.physicalName);

    //window.open(this.activityService.apiUrl + "/cartable/uploadfiles/" + rowData.physicalName, '_blank');
    this.selected = rowData;
    this.urls = [''];
    if (rowData.object) {
      var f = rowData.object.arrayBuffer.toString();
      this.urls = <string[]> [f];
    } else {

      this.activityService.getFile(rowData.objectId).subscribe(async (res) => {

        var appfile = res;

        if (this.findType(appfile.fileName) == 'other') {

          var file: any = `data:${appfile.dataContentType};base64,` + appfile.data;
          file = await this.appFileManagerService.convertToFile(file, res);
          this.appFileManagerService.openFile(file, res);
        } else {
          this.urls = <string[]> [appfile.data];
          rowData.object = res;
        }
      }, error => {
        console.error(error);
      });
    }

  }

  findType(name: string): string {
    var temp = name.split('.');
    if (temp.length > 0) {
      if (temp[temp.length - 1].toLowerCase() == 'png' || temp[temp.length - 1].toLowerCase() == 'jpeg' || temp[temp.length - 1].toLowerCase() == 'jpg') {
        return 'img';
      } else if (temp[temp.length - 1].toLowerCase() == 'pdf' || temp[temp.length - 1].toLowerCase() == 'tif') {
        return 'pdf';
      } else {
        return 'other';
      }
    } else {
      return '';
    }
  }

  forward(id: number) {
    this.router.navigate(['cartable/forward/' + id]);
  }

  reply(id: number) {
    this.router.navigate(['cartable/reply/' + id]);
  }

  return(id: number) {
    this.router.navigate(['cartable/return/' + id]);
  }

  isNotYours(): boolean {
    return (this.activity && this.activity.sender && this.activity.sender.user?.id != this.userService.curUser?.id);
  }

}
