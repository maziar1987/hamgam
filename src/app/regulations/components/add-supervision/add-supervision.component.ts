import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, DialogService } from 'primeng';
import { AppFileManagerService } from 'src/app/app-file-manager/app-file-manager.service';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { BasicValue, BasicValueType } from 'src/app/basicinfo/basic-value/basic-value.model';
import { BasicValueService } from 'src/app/basicinfo/basic-value/basic-value.service';
import { StartProcessInstanceBody } from 'src/app/cartable-new/models/start-process-instance-body';
import { WorkflowVariableType } from 'src/app/cartable/models/workflow-variable-type.enum';
import { ExpertPersonService } from 'src/app/expert-person/expert-person.service';
import { EntityType } from 'src/app/policy/models/entity-type.enum';
import { Workflow, WorkflowStep } from 'src/app/workflow/models';
import { WorkflowButtonEvent } from 'src/app/workflow/workflow-shared/workflow-button-group/models';
import { WorkflowButtonGroupService } from 'src/app/workflow/workflow-shared/workflow-button-group/services/workflow-button-group.service';
import { ActivityObject, ActivitySend, SendType } from '../../../cartable-new/models';
import { ActivityService } from '../../../cartable-new/services/activity.service';
import { ProposalService } from '../proposal/proposal.service';
import { RegulationCertificateService } from '../regulations-certificate/regulation-certificate.service';
import { RegulationsCertificate } from '../regulations-certificate/regulations-certificate.model';
import { Responsibility, TeamMemberDTO, TeamModal } from '../specialized-team/specialized-team.model';
import { SpecializesTeamService } from '../specialized-team/specializedTeam.service';
import { AddSupervisionEditComponent } from './add-supervision-edit/add-supervision-edit.component';
import { AddSupervisionModalComponent } from './add-supervision-modal/add-supervision-modal.component';

@Component({
  selector: 'add-supervision',
  templateUrl: './add-supervision.component.html',
  styleUrls: ['./add-supervision.component.scss'],
  providers: [WorkflowButtonGroupService]
})
export class AddSupervisionComponent extends BaseComponent implements OnInit {
  teams: TeamModal[] = [];
  editMode = false;
  itemEdit: TeamModal;
  responsibilities: BasicValue[] = [];
  certificateId: number;
  hasProposal = false;
  teamMembers: TeamMemberDTO[] = [];
  activityId: number;
  wfTaskId: any;
  activityType: any;
  deletedMembers: number[] = [];
  certificate: RegulationsCertificate;
  isCartable = false;

  constructor(
    public workflowButtonGroupService: WorkflowButtonGroupService,
    private basicinfoServic: BasicValueService,
    private route: ActivatedRoute,
    public dialogService: DialogService,
    private proposalService: ProposalService,
    private activityService: ActivityService,
    private certificateService: RegulationCertificateService,
    private sanitizer: DomSanitizer,
    public appFileManager: AppFileManagerService,
    private expertPersonService: ExpertPersonService,
    private specializesService: SpecializesTeamService,
    private location: Location,
    private confirmationService: ConfirmationService
  ) { super(); }

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
        this.loadData(p.id);
      }
    });
  }
  createButtons() {
    // this.workflowButtonGroupService.addCreateButton(({ srcElementEvent }: { srcElementEvent: any }): void => { this.Save(); });
    this.workflowButtonGroupService.addEditButton((): void => { this.Save(); });
    this.workflowButtonGroupService.addBackButton((): void => { this.onBack(); });
    if (this.isCartable && this.editMode) {
      this.workflowButtonGroupService.addSendButton({
        showCreateActivity: true,
        onClick: (event: WorkflowButtonEvent): void => { this.send(); }
      });
    }

    this.workflowButtonGroupService.setWorkFlowInfo({ workflow: Workflow.Certificate, workflowStep: WorkflowStep.AddSupervision });

    // this.workflowButtonGroupService.createButtonDisable(this.form);
    // this.workflowButtonGroupService.editButtonDisable(this.form);

    this.workflowButtonGroupService.checkPolicy(EntityType.supervisionContract);
    this.workflowButtonGroupService.setEditMode(this.editMode);
  }
  loadData(certificateId: number) {
    this.teams = [];
    this.certificateId = certificateId;
    this.proposalService.getProposal(this.certificateId).subscribe(proposal => {
      if (proposal) {
        this.hasProposal = true;
      }
    });
    this.certificateService.getCertificateById(this.certificateId).subscribe(certificate => {
      this.certificate = certificate;
    });
    this.specializesService.getSpecializesTeamByCertificate(certificateId)
      .subscribe(team => {

        if (team.length > 0) {
          this.teamMembers = team;
          this.editMode = true;
          this.workflowButtonGroupService.clearButtons();
          this.createButtons();
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
          this.createButtons();
        }
      }, error => {
      });
  }
  showModal() {
    const ref = this.dialogService.open(AddSupervisionModalComponent, {
      header: 'افزودن ناظر',
      closable: false,
      width: '60%',
      contentStyle: { 'overflow-x': 'hidden', 'direction': 'rtl', 'text-align': 'right' }
    });
    ref.onClose.subscribe((TeamModal: TeamModal) => {
      if (TeamModal) {

        // this.teamsActive = this.teams.filter(x => new Date(x.endDate) > new Date() || x.endDate == null);
        // if (this.teams.filter(x => x.expertPersonId == TeamModal.expertPersonId).length > 0) {
        //   this.translate.get('regulations.specializedTeam').subscribe(res => {
        //     this.msgService.add({ severity: 'error', summary: res.message.error, detail: res.message.duplicate, key: 'tl' });
        //   });
        //   return;
        // }
        // if (TeamModal.responsibilityCode == Responsibility.Boss && this.teamsActive.filter(x => x.responsibilityCode == Responsibility.Boss).length > 0) {
        //   this.translate.get('regulations.specializedTeam').subscribe(res => {
        //     this.msgService.add({ severity: 'error', summary: res.message.error, detail: res.message.uniqueBoos, key: 'tl' });
        //   });
        //   return;
        // }
        // if (TeamModal.responsibilityCode == Responsibility.Secretary && this.teamsActive.filter(x => x.responsibilityCode == Responsibility.Secretary).length > 0) {
        //   this.translate.get('regulations.specializedTeam').subscribe(res => {
        //     this.msgService.add({ severity: 'error', summary: res.message.error, detail: res.message.uniqueSecretary, key: 'tl' });
        //   });
        //   return;
        // }
        // if (TeamModal.responsibilityCode == Responsibility.Supervisor && this.teamsActive.filter(x => x.responsibilityCode == Responsibility.Supervisor).length > 0) {
        //   this.translate.get('regulations.specializedTeam').subscribe(res => {
        //     this.msgService.add({ severity: 'error', summary: res.message.error, detail: res.message.uniqueSupervisor, key: 'tl' });
        //   });
        //   return;
        // }
        this.AddMember(TeamModal);
      }
    });
  }
  AddMember(teamModel: TeamModal) {
    if (teamModel) {

      if (this.teams.filter(x => x.expertPersonId == teamModel.expertPersonId).length > 0) {
        this.translate.get('regulations.specializedTeam').subscribe(res => {
          this.errorNotify({ detail: res.message.duplicate, summary: res.message.error });
        });
        return;
      }
      if (this.teams.filter(x => (new Date(x.endDate) > new Date() || x.endDate == null) && x.responsibilityCode == Responsibility.Supervision).length > 0) {
        this.translate.get('regulations.specializedTeam').subscribe(res => {
          this.errorNotify({ detail: res.message.uniqueSupervision, summary: res.message.error });
        });
        return;
      }
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
  tActive(team: TeamModal): boolean {
    return (new Date(team.endDate) > new Date() || team.endDate == null ? true : false);
  }
  IsSupervision(team: TeamModal): boolean {
    return (team.responsibilityCode == Responsibility.Supervision ? true : false);
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
  // EditeItem(team: TeamModal) { }
  EditeItem(team: TeamModal) {

    this.itemEdit = team;
    let index: number;
    index = this.teams.indexOf(team);
    if (index > -1) {
      this.teams.splice(index, 1);
    }


    const ref = this.dialogService.open(AddSupervisionEditComponent, {
      data: {
        itemEdit: this.itemEdit
      },
      header: 'ویرایش ناظر',
      closable: false,
      width: '60%',
      contentStyle: { 'overflow-x': 'hidden', 'direction': 'rtl', 'text-align': 'right' }
    });
    ref.onClose.subscribe((TeamModal: TeamModal) => {
      if (TeamModal) {
        // this.teamsActive = this.teams.filter(x => new Date(x.endDate) > new Date() || x.endDate == null);
        // if (this.teams.filter(x => x.expertPersonId == TeamModal.expertPersonId).length > 0) {
        //   this.translate.get('regulations.specializedTeam').subscribe(res => {
        //     this.msgService.add({ severity: 'error', summary: res.message.error, detail: res.message.duplicate, key: 'tl' });
        //   });
        //   this.teams.push(this.itemEdit);
        //   return;
        // }
        // if (TeamModal.responsibilityCode == Responsibility.Boss && this.teamsActive.filter(x => x.responsibilityCode == Responsibility.Boss).length > 0) {
        //   this.translate.get('regulations.specializedTeam').subscribe(res => {
        //     this.msgService.add({ severity: 'error', summary: res.message.error, detail: res.message.uniqueBoos, key: 'tl' });
        //   });
        //   this.teams.push(this.itemEdit);
        //   return;
        // }
        // if (TeamModal.responsibilityCode == Responsibility.Secretary && this.teamsActive.filter(x => x.responsibilityCode == Responsibility.Secretary).length > 0) {
        //   this.translate.get('regulations.specializedTeam').subscribe(res => {
        //     this.msgService.add({ severity: 'error', summary: res.message.error, detail: res.message.uniqueSecretary, key: 'tl' });
        //   });
        //   this.teams.push(this.itemEdit);
        //   return;
        // }
        // if (TeamModal.responsibilityCode == Responsibility.Supervisor && this.teamsActive.filter(x => x.responsibilityCode == Responsibility.Supervisor).length > 0) {
        //   this.translate.get('regulations.specializedTeam').subscribe(res => {
        //     this.msgService.add({ severity: 'error', summary: res.message.error, detail: res.message.uniqueSupervisor, key: 'tl' });
        //   });
        //   this.teams.push(this.itemEdit);
        //   return;
        // }
        this.AddMember(TeamModal);
      } else {
        this.teams.push(this.itemEdit);
      }
    });
  }
  Save() {
    this.workflowButtonGroupService.loading();
    if (!this.certificateId) {
      this.translate.get('regulations.specializedTeam').subscribe(res => {
        this.errorNotify({ detail: res.message.selectRegulations, summary: res.message.error });
      });
    }
    if (this.teams.filter(x => x.responsibilityCode === Responsibility.Supervision).length === 0) {
      this.translate.get('regulations.specializedTeam').subscribe(res => {
        this.errorNotify({ detail: res.message.minRequirSupervision, summary: res.message.error });
      });
    } else {
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
        this.workflowButtonGroupService.unLoading();
        this.loadData(this.certificateId);
        this.translate.get('message.save').subscribe(message => {
          this.successNotify({ detail: message.successful.successMessage, summary: message.successful.successful });
        });
      }, error => {
        this.workflowButtonGroupService.unLoading();
        this.translate.get('message.save').subscribe(message => {
          this.errorNotify({ detail: message.unsuccessful.errorMessage, summary: message.unsuccessful.unsuccessful });
        });
      });
    }
  }
  onSend(activityText: string) {
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
    this.workflowButtonGroupService.loading();
    this.activityService.completeProcess(activity, startProcessInstanceBody, this.activityId).subscribe(res => {
      this.workflowButtonGroupService.unLoading();
      this.successNotify({ detail: 'ارسال با موفقیت انجام گردید', summary: 'عملیات موفق' });
    }, error => {
      this.workflowButtonGroupService.unLoading();
      console.log(error);
      this.errorNotify({ detail: 'خطا هنگام ارسال', summary: 'رخداد خطا' });
    });
  }
  send() {
    if (this.hasProposal) {
      this.confirmationService.confirm({
        message: 'ایا نیاز به بازبینی پیشنهادیه توسط تیم می باشد؟', acceptLabel: 'بله', rejectLabel: 'خیر', accept: () => {
          this.hasProposal = true;
          console.log('accept');
        }, reject: () => {
          this.hasProposal = false;
          console.log('reject');
        }
      });
      this.onSend(null);
    } else {
      this.onSend(null);
    }
  }
  onBack() {
    this.location.back();
  }
}
