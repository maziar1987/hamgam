import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng';
import { ConfirmationService } from 'primeng/api';
import { AppFileManagerService } from 'src/app/app-file-manager/app-file-manager.service';
import { BasicValue, BasicValueType } from 'src/app/basicinfo/basic-value/basic-value.model';
import { BasicValueService } from 'src/app/basicinfo/basic-value/basic-value.service';
import { ExpertPersonService } from 'src/app/expert-person/expert-person.service';
import { EntityType } from 'src/app/policy/models/entity-type.enum';
import {
  Responsibility,
  TeamMemberDTO,
  TeamModal
} from 'src/app/regulations/components/specialized-team/specialized-team.model';
import { Workflow, WorkflowStep } from 'src/app/workflow/models';
import { WorkflowButtonEvent } from 'src/app/workflow/workflow-shared/workflow-button-group/models';
import { BaseComponent } from '../../../app-shared/base/base.component';
import { AcceptComponent } from '../../../app-shared/components/accept/accept.component';
import { ActivityObject, ActivitySend, SendType } from '../../../cartable-new/models';
import { StartProcessInstanceBody } from '../../../cartable-new/models/start-process-instance-body';
import { ActivityService } from '../../../cartable-new/services/activity.service';
import { WorkflowVariableType } from '../../../cartable/models/workflow-variable-type.enum';
import { WorkflowButton } from '../../../workflow/workflow-shared/workflow-button-group/models/workflow-button';
import { WorkflowButtonGroupService } from '../../../workflow/workflow-shared/workflow-button-group/services/workflow-button-group.service';
import { ProposalService } from '../proposal/proposal.service';
import { RegulationCertificateService } from '../regulations-certificate/regulation-certificate.service';
import { RegulationsCertificate } from '../regulations-certificate/regulations-certificate.model';
import { SpecializedTeamEditComponent } from './specialized-team-edit/specialized-team-edit.component';
import { SpecializedTeamModalComponent } from './specialized-team-modal/specialized-team-modal.component';
import { SpecializesTeamService } from './specializedTeam.service';

@Component({
  selector: 'app-specialized-team-create',
  templateUrl: './specialized-team-create.component.html',
  styleUrls: ['./specialized-team-create.component.scss'],
  providers: [WorkflowButtonGroupService]
})
export class SpecializedTeamCreateComponent extends BaseComponent implements OnInit {

  @ViewChild('accept_modal') accept_modal: AcceptComponent;

  teams: TeamModal[] = [];
  teamsActive: TeamModal[] = [];
  itemEdit: TeamModal;
  teamMembers: TeamMemberDTO[] = [];
  deletedMembers: number[] = [];
  responsibilities: BasicValue[] = [];
  certificateId: number;
  editMode = false;
  hasProposal = false;
  activityId: number;
  wfTaskId: any;
  activityType: any;
  certificate: RegulationsCertificate;
  actionTranslate: any;
  buttons: WorkflowButton[] = [];
  isCartable = false;

  private _location: Location;

  constructor(
    private location: Location,
    private workflowButtonGroupService: WorkflowButtonGroupService,
    public dialogService: DialogService,
    private basicinfoServic: BasicValueService,
    private sanitizer: DomSanitizer,
    private specializesService: SpecializesTeamService,
    public appFileManager: AppFileManagerService,
    private route: ActivatedRoute,
    private router: Router,
    private expertPersonService: ExpertPersonService,
    private activityService: ActivityService,
    private certificateService: RegulationCertificateService,
    private proposalService: ProposalService,
    private confirmationService: ConfirmationService) {
    super();
    this._location = location;
  }

  ngOnInit(): void {
    this.basicinfoServic.getBasicInfo(BasicValueType.responsibilityTeam).subscribe(res => {
      this.responsibilities = res.children;
    }, error => {
    });
    this.route.params.subscribe(p => {
      if (Object.keys(p).length !== 0) {
        this.activityId = p.aid;
        this.wfTaskId = p.wfTaskId;
        this.activityType = p.activityType;
        if (this.activityId) {
          this.isCartable = true;
        }
        this.certificateId = p.id;
      }
    });
    if (this.certificateId) {
      this.loadData(this.certificateId);
    }
  }

  loadData(certificateId: number) {
    this.teams = [];
    this.proposalService.getProposal(this.certificateId).subscribe(proposal => {
      if (proposal) {
        this.hasProposal = true;
      }
    });
    this.certificateService.getCertificateById(this.certificateId).subscribe(certificate => {
      this.certificate = certificate;
      this.specializesService.getSpecializesTeamByCertificate(certificateId)
        .subscribe(team => {
          if (team.length > 0) {
            this.teamMembers = team;
            this.editMode = true;
            this.createButton();
            this.teamMembers.forEach(x => {
              this.expertPersonService.getExpertPerson(x.expertPersonId).subscribe(ExpertPerson => {
                const teamModal = {
                  id: x.id,
                  endDate: x.endDate,
                  expertPersonId: x.expertPersonId,
                  expertPerson: ExpertPerson,
                  startDate: x.startDate,
                  responsibilityId: x.responsibilityId,
                  responsibility: this.responsibilities.filter(i => i.id == x.responsibilityId)[0],
                  responsibilityCode: Number(this.responsibilities.filter(i => i.id == x.responsibilityId)[0].code),
                  fullName: `${ExpertPerson.firstName} ${ExpertPerson.lastName}`
                } as TeamModal;
                teamModal.personImageFileUrl = '../../../assets/img/user1.jpg';
                if (ExpertPerson.personImageId) {
                  this.appFileManager.getFile(ExpertPerson.personImageId).subscribe(async (res) => {
                    teamModal.expertPerson.personImage = res;
                    const objectURL = `data:${res.dataContentType};base64,` + res.data;
                    teamModal.personImageFileUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                  });
                }
                this.teams.push(teamModal);
              });
            });
          } else {
            this.createButton();
          }
        }, error => {
        });
    }, error => {
    });

  }

  DeleteItem(team: TeamModal) {

    if (team.id) {
      this.deletedMembers.push(team.id);
    }
    let index: number;
    index = this.teams.indexOf(team);
    if (index > -1) {
      this.teams.splice(index, 1);
    }

  }

  tActive(team: TeamModal): boolean {
    return (new Date(team.endDate) > new Date() || team.endDate == null ? true : false);
  }

  // InfoItem(team: TeamModal){
  //   this.router.navigate(["experts/", team.expertPersonId]);
  // }
  EditeItem(team: TeamModal) {

    this.itemEdit = team;
    let index: number;
    index = this.teams.indexOf(team);
    if (index > -1) {
      this.teams.splice(index, 1);
    }


    const ref = this.dialogService.open(SpecializedTeamEditComponent, {
      data: {
        itemEdit: this.itemEdit
      },
      header: 'ویرایش فرد',
      closable: false,
      width: '60%',
      contentStyle: { 'overflow-x': 'hidden', 'direction': 'rtl', 'text-align': 'right' }
    });
    ref.onClose.subscribe((TeamModal: TeamModal) => {
      if (TeamModal) {
        this.teamsActive = this.teams.filter(x => new Date(x.endDate) > new Date() || x.endDate == null);
        if (this.teams.filter(x => x.expertPersonId == TeamModal.expertPersonId).length > 0) {
          this.translate.get('regulations.specializedTeam').subscribe(res => {
            this.errorNotify({ detail: res.message.duplicate, summary: res.message.error });
          });
          this.teams.push(this.itemEdit);
          return;
        }
        if (TeamModal.responsibilityCode == Responsibility.Boss && this.teamsActive.filter(x => x.responsibilityCode == Responsibility.Boss).length > 0) {
          this.translate.get('regulations.specializedTeam').subscribe(res => {
            this.errorNotify({ detail: res.message.uniqueBoos, summary: res.message.error });
          });
          this.teams.push(this.itemEdit);
          return;
        }
        if (TeamModal.responsibilityCode == Responsibility.Secretary && this.teamsActive.filter(x => x.responsibilityCode == Responsibility.Secretary).length > 0) {
          this.translate.get('regulations.specializedTeam').subscribe(res => {
            this.errorNotify({ detail: res.message.uniqueSecretary, summary: res.message.error });
          });
          this.teams.push(this.itemEdit);
          return;
        }
        if (TeamModal.responsibilityCode == Responsibility.Supervisor && this.teamsActive.filter(x => x.responsibilityCode == Responsibility.Supervisor).length > 0) {
          this.translate.get('regulations.specializedTeam').subscribe(res => {
            this.errorNotify({ detail: res.message.uniqueSupervisor, summary: res.message.error });
          });
          this.teams.push(this.itemEdit);
          return;
        }
        this.AddMember(TeamModal);
      } else {
        this.teams.push(this.itemEdit);
      }
    });
  }

  showModal() {
    const ref = this.dialogService.open(SpecializedTeamModalComponent, {
      header: 'افزودن فرد',
      closable: false,
      width: '60%',
      contentStyle: { 'overflow-x': 'hidden', 'direction': 'rtl', 'text-align': 'right' }
    });
    ref.onClose.subscribe((TeamModal: TeamModal) => {
      if (TeamModal) {

        this.teamsActive = this.teams.filter(x => new Date(x.endDate) > new Date() || x.endDate == null);
        if (this.teams.filter(x => x.expertPersonId == TeamModal.expertPersonId).length > 0) {
          this.translate.get('regulations.specializedTeam').subscribe(res => {
            this.errorNotify({ detail: res.message.duplicate, summary: res.message.error });
          });
          return;
        }
        if (TeamModal.responsibilityCode == Responsibility.Boss && this.teamsActive.filter(x => x.responsibilityCode == Responsibility.Boss).length > 0) {
          this.translate.get('regulations.specializedTeam').subscribe(res => {
            this.errorNotify({ detail: res.message.uniqueBoos, summary: res.message.error });
          });
          return;
        }
        if (TeamModal.responsibilityCode == Responsibility.Secretary && this.teamsActive.filter(x => x.responsibilityCode == Responsibility.Secretary).length > 0) {
          this.translate.get('regulations.specializedTeam').subscribe(res => {
            this.errorNotify({ detail: res.message.uniqueSecretary, summary: res.message.error });
          });
          return;
        }
        if (TeamModal.responsibilityCode == Responsibility.Supervisor && this.teamsActive.filter(x => x.responsibilityCode == Responsibility.Supervisor).length > 0) {
          this.translate.get('regulations.specializedTeam').subscribe(res => {
            this.errorNotify({ detail: res.message.uniqueSupervisor, summary: res.message.error });
          });
          return;
        }
        this.AddMember(TeamModal);
      }
    });
  }

  AddMember(teamModel: TeamModal) {
    if (teamModel) {
      teamModel.fullName = `${teamModel.expertPerson.firstName} ${teamModel.expertPerson.lastName}`;
      teamModel.personImageFileUrl = '../../../assets/img/user1.jpg';
      if (teamModel.expertPerson.personImageId) {
        this.appFileManager.getFile(teamModel.expertPerson.personImageId).subscribe(async (res) => {
          teamModel.expertPerson.personImage = res;
          const objectURL = `data:${res.dataContentType};base64,` + res.data;
          teamModel.personImageFileUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        });
      }
      this.teams.push(teamModel);
    }
  }

  send(activityText: string) {
    if (this.hasProposal) {
      this.confirmationService.confirm({
        message: 'ایا نیاز به بازبینی پیشنهادیع توسط تیم می باشد؟', acceptLabel: 'بله', rejectLabel: 'خیر', accept: () => {
          this.hasProposal = true;
          console.log('accept');
        }, reject: () => {
          this.hasProposal = false;
          console.log('reject');
        }
      });
      this.onSend(activityText);
    } else {
      this.onSend(activityText);
    }
  }

  onSubmit() {
    if (!this.certificateId) {
      this.translate.get('regulations.specializedTeam').subscribe(res => {
        this.errorNotify({ detail: res.message.selectRegulations, summary: res.message.error });
      });
    }
    if (this.teams.filter(x => x.responsibilityCode === Responsibility.Boss).length === 0 ||
      this.teams.filter(x => x.responsibilityCode === Responsibility.Member).length === 0 ||
      this.teams.filter(x => x.responsibilityCode === Responsibility.Secretary).length === 0) {
      this.translate.get('regulations.specializedTeam').subscribe(res => {
        this.errorNotify({ detail: res.message.minRequir, summary: res.message.error });
      });
    } else {
      this.workflowButtonGroupService.loading();
      this.teamMembers = [];
      this.teams.forEach(item => {
        if (!item.id && this.certificateId) {
          const teamMember = {
            expertPersonId: item.expertPersonId,
            certificateId: this.certificateId,
            endDate: item.endDate,
            startDate: item.startDate,
            responsibilityId: item.responsibilityId
          } as TeamMemberDTO;
          this.teamMembers.push(teamMember);
        }
        if (item.id && item.edit && this.certificateId) {
          const teamMember = {
            id: item.id,
            expertPersonId: item.expertPersonId,
            certificateId: this.certificateId,
            endDate: item.endDate,
            startDate: item.startDate,
            responsibilityId: item.responsibilityId
          } as TeamMemberDTO;
          this.teamMembers.push(teamMember);
        }
      });
      this.specializesService.save(this.teamMembers, this.deletedMembers).subscribe(res => {
        this.loadData(this.certificateId);
        this.translate.get('message.save').subscribe(message => {
          this.successNotify({ detail: message.successful.successMessage, summary: message.successful.successful });
        });
        this.workflowButtonGroupService.unLoading();
      }, error => {
        this.translate.get('message.save').subscribe(message => {
          this.errorNotify({ detail: message.unsuccessful.errorMessage, summary: message.unsuccessful.unsuccessful });
        });
        this.workflowButtonGroupService.unLoading();
      });
    }
  }

  onSend(activityText: string) {
    this.workflowButtonGroupService.loading();
    const obj: ActivityObject =
    {
      name: 'Certificate',
      objectType: 'Certificate',
      objectId: this.certificate.id
    };
    const activity: ActivitySend =
    {
      sendType: SendType.FORWARD,
      text: activityText,
      subject: this.certificate.title,
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
        taskId: { value: this.wfTaskId, type: WorkflowVariableType[WorkflowVariableType.String] },
        ff_requiredForReview: { value: this.hasProposal, type: WorkflowVariableType[WorkflowVariableType.Boolean] }
      }
    } as StartProcessInstanceBody;
    this.activityService.completeProcess(activity, startProcessInstanceBody, this.activityId).subscribe(res => {
      this.workflowButtonGroupService.unLoading();
      this.successNotify({ detail: 'ارسال با موفقیت انجام گردید', summary: 'عملیات موفق' });
    }, error => {
      this.workflowButtonGroupService.unLoading();
      this.errorNotify({ detail: 'خطا هنگام ارسال', summary: 'رخداد خطا' });
    });
  }

  IsSupervision(team: TeamModal): boolean {
    return (team.responsibilityCode == Responsibility.Supervision ? false : true);
  }

  onBack() {
    this._location.back();
  }

  createButton() {
    this.workflowButtonGroupService.clearButtons();
    if (!this.editMode) {
      this.workflowButtonGroupService.addCreateButton(({ srcElementEvent }: { srcElementEvent: any }): void => {
        this.onSubmit();
      });
    } else {
      this.workflowButtonGroupService.addEditButton((): void => {
        this.onSubmit();
      });
    }
    this.workflowButtonGroupService.addBackButton((): void => {
      this.onBack();
    });
    if (this.isCartable && this.editMode) {
      this.workflowButtonGroupService.addSubmitAndSendButton({
        showCreateActivity: true,
        onClick: (event: WorkflowButtonEvent): void => { this.send(event.activity.text); }
      });
    }

    this.workflowButtonGroupService.setWorkFlowInfo({ workflow: Workflow.Certificate, workflowStep: WorkflowStep.SpecializedTeam });

    // this.workflowButtonGroupService.createButtonDisabled(this.form);
    // this.workflowButtonGroupService.createButtonDisabled(this.form);

    this.workflowButtonGroupService.checkPolicy(EntityType.teamMember);
    this.workflowButtonGroupService.setEditMode(this.editMode);
  }
}
