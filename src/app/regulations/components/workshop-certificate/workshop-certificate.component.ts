import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { AppFileManagerService } from 'src/app/app-file-manager/app-file-manager.service';
import { BasicValue, BasicValueType } from 'src/app/basicinfo/basic-value/basic-value.model';
import { BasicValueService } from 'src/app/basicinfo/basic-value/basic-value.service';
import { ActivityObject, ActivitySend, SendType } from 'src/app/cartable-new/models';
import { StartProcessInstanceBody } from 'src/app/cartable-new/models/start-process-instance-body';
import { WorkflowVariableType } from 'src/app/cartable/models/workflow-variable-type.enum';
import { EntityType } from 'src/app/policy/models/entity-type.enum';
import { Workflow, WorkflowStep } from 'src/app/workflow/models';
import { WorkflowButtonEvent } from 'src/app/workflow/workflow-shared/workflow-button-group/models';
import { WorkflowButtonGroupService } from 'src/app/workflow/workflow-shared/workflow-button-group/services/workflow-button-group.service';
import { BaseComponent } from '../../../app-shared/base/base.component';
import { ActivityService } from '../../../cartable-new/services/activity.service';
import { RegulationCertificateService } from '../regulations-certificate/regulation-certificate.service';
import { certificate } from '../rfp/rfp.model';
import { SpecializesTeamService } from '../specialized-team/specializedTeam.service';
import { WorkshopTeam } from './models/workshop-certificate-team';
import { WorkshopCertificateService } from './workshop-certificate.service';

@Component({
  selector: 'app-workshop-certificate',
  templateUrl: './workshop-certificate.component.html',
  styleUrls: ['./workshop-certificate.component.scss'],
  providers: [WorkflowButtonGroupService]
})
export class WorkshopCertificateComponent extends BaseComponent implements OnInit {
  certificate: certificate;
  certificateId: number;
  cols: any;
  loading: boolean = false;
  activityId: number;
  wfTaskId: any;
  activityType: any;
  isCartable = false;
  workshopTeam: WorkshopTeam[] = [];
  responsibilities: BasicValue[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private certificateService: RegulationCertificateService,
    private specializesService: SpecializesTeamService,
    private basicinfoServic: BasicValueService,
    public appFileManager: AppFileManagerService,
    private workshopCertificateService: WorkshopCertificateService,
    public workflowButtonGroupService: WorkflowButtonGroupService,
    private fb: FormBuilder,
    private location: Location,
    private activityService: ActivityService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      validate: ['', [Validators.required]]
    });
    this.createButtons();
    this.setCols();
    this.basicinfoServic.getBasicInfo(BasicValueType.responsibilityTeam).subscribe(res => {
      this.responsibilities = res.children;
    }, error => {
    });

    this.activatedRoute.paramMap.subscribe(p => {

      this.certificateId = +p.get('id');
      this.activityId = +p.get('aid');
      this.wfTaskId = p.get('wfTaskId');
      this.activityType = p.get('activityType');
      if (this.activityId) {
        this.isCartable = true;
      }

      if (!this.certificateId) {
        this.warningNotify({ detail: 'ابتدا باید شناسنامه آیین نامه را ثبت نمایید', summary: 'اخطار' });
        this.router.navigate(['../', 'certificate'], { relativeTo: this.activatedRoute });
        return;
      }
      this.loadData(this.certificateId);

    });
  }

  createButtons() {

    this.workflowButtonGroupService.addCreateButton(({ srcElementEvent }: { srcElementEvent: any }): void => {
      this.Save();
    });
    this.workflowButtonGroupService.addBackButton((): void => {
      this.onBack();
    });
    if (this.isCartable) {
      this.workflowButtonGroupService.addSendButton({
        showCreateActivity: true,
        onClick: (event: WorkflowButtonEvent): void => { this.send(event.activity.text); }
      });
    }

    this.workflowButtonGroupService.setWorkFlowInfo({ workflow: Workflow.Certificate, workflowStep: WorkflowStep.Workshop });

    this.workflowButtonGroupService.createButtonCheckFormInvalid(this.form);
    this.workflowButtonGroupService.checkPolicy(EntityType.supervisionContract);

  }

  Save() {
    setTimeout(() => {
      this.successNotify({ detail: 'ثبت با موفقیت انجام شد', summary: 'عملیات موفق' });
    }, 2000);

  }

  onBack() {
    this.location.back();
  }

  send(activityText: string) {
    this.onSend(activityText);
  }

  onSend(activityText: string) {
    const obj: ActivityObject =
    {
      name: 'Certificate',
      objectType: 'Certificate',
      objectId: this.certificateId
    };
    const activity: ActivitySend =
    {
      sendType: SendType.FORWARD,
      text: activityText,
      subject: this.certificate?.title,
      activityObject: obj,
      // receivers: [this.currentUser.id]
    };

    const startProcessInstanceBody = {
      businessKey: this.certificateId.toString(),
      variables: {
        approved: { value: true, type: WorkflowVariableType[WorkflowVariableType.Boolean] },
        formName: { value: 'Certificate', type: WorkflowVariableType[WorkflowVariableType.String] },
        unitId: { value: this.currentUser.orgUnit.id, type: WorkflowVariableType[WorkflowVariableType.Integer] },
        userId: { value: this.currentUser.id, type: WorkflowVariableType[WorkflowVariableType.Integer] },
        taskId: { value: this.wfTaskId, type: WorkflowVariableType[WorkflowVariableType.String] }
      }
    } as StartProcessInstanceBody;
    this.activityService.completeProcess(activity, startProcessInstanceBody, this.activityId).subscribe(res => {
      console.log(res);
      this.successNotify({ detail: 'شروع فرآیند آیین نامه', summary: 'عملیات موفق' });
    }, error => {
      console.log(error);
      this.errorNotify({ detail: 'خطا در شروع فرآیند آیین نامه', summary: 'رخداد خطا' });
    });
  }

  loadData(certificateId: number) {
    this.loading = true;
    this.certificateService.getCertificate(certificateId).subscribe(cert => {
      this.certificate = cert;

    }, error => {
    });
    this.workshopCertificateService.getWorkshopByCertificate(certificateId).subscribe(res => {
      this.specializesService.getSpecializesTeamByCertificate(certificateId)
        .subscribe(team => {
          if (team.length == res.length) {
            this.form.get('validate').setValue(true);
          }

          team.forEach(x => {
            const temp = {
              teamMemberId: x.id,
              responsibilityId: x.responsibilityId,
              responsibilityName: this.responsibilities.find(i => i.id == x.responsibilityId).title,
              teamFullName: `${x.expertPerson.firstName} ${x.expertPerson.lastName}`,
              isActive: (new Date(x.endDate) > new Date() || x.endDate == null ? true : false)
            } as WorkshopTeam;
            let workshop = res.find(o => o.teamMemberId == x.id);
            if (workshop) {
              temp.id = workshop.id;
              temp.description = workshop.description;
              temp.hasCertificate = workshop.hasCertificate;
              temp.fileId = workshop.fileId;
              temp.certificateNO = workshop.certificateNO;
            }
            this.workshopTeam.push(temp);
          });
          this.loading = false;

        });
    });

  }

  getMenuItems(rowNode: WorkshopTeam): MenuItem[] {
    let action: any;
    this.translate.get('action').subscribe(res => {
      action = res;
    });

    const items = [] as MenuItem[];
    items.push(
      {
        label: action.edit, icon: 'pi pi-pencil', command: () => {
          this.onEdite(rowNode);
        }
      });
    return items;
  }

  setCols() {
    // this.translate.get('policy').subscribe(policy => {
    this.cols = [
      { field: 'responsibilityName', header: 'سمت' },
      { field: 'teamFullName', header: 'نام و نام خانوادگی' },
      { field: 'hasCertificate', header: 'وضعیت گواهینامه' },
      { field: 'certificateNO', header: 'شماره گواهینامه' },
      { field: 'fileId', header: 'فایل گواهینامه' },
      { field: 'description', header: 'توضیحات' },

    ];
    // });
  }

  downloadAttach(rowNode: WorkshopTeam) {
    this.appFileManager.getFile(rowNode.fileId).subscribe(res => {
      this.appFileManager.convertToFile(`data:${res.dataContentType};base64,${res.data}`, res).then(
        f => this.appFileManager.openFile(f)
      );
    });
  }

  onEdite(rowNode: WorkshopTeam) {
    if (rowNode.id) {
      this.router.navigate(['regulations/add-edit/workshop-edit/' + this.certificateId, {
        Workshopid: rowNode.id,
        name: rowNode.teamFullName
      }]);
    } else {
      this.router.navigate(['regulations/add-edit/workshop-edit/' + this.certificateId, {
        teamid: rowNode.teamMemberId,
        name: rowNode.teamFullName
      }]);
    }
  }

}
