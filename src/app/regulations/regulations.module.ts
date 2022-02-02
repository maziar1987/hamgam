import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyPrimeNGModule } from '@ngx-formly/primeng';
import { DataViewModule, FieldsetModule, InputNumberModule } from 'primeng';
import { AppSharedModule } from '../app-shared/app-shared.module';
import { DatepickerBasicJalaliFormlyComponent } from '../app-shared/components/formly/datepicker-basic-jalali-formly/datepicker-basic-jalali-formly.component';
import { BasicValueSharedModule } from '../basicinfo/basic-value/basic-value-shared/basic-value-shared.module';
import { OrgUnitSharedModule } from '../basicinfo/org-unit/org-unit-shared/org-unit-shared.module';
import { ActivitySharedModule } from '../cartable-new/activity-shared/activity-shared.module';
import { ExpertPersonSharedModule } from '../expert-person/expert-person-shared/expert-person-shared.module';
import { WorkflowSharedModule } from '../workflow/workflow-shared/workflow-shared.module';
import { RegulationsAddEditComponent } from './components/add-edit/regulations-add-edit.component';
import { AddSupervisionEditComponent } from './components/add-supervision/add-supervision-edit/add-supervision-edit.component';
import { AddSupervisionModalComponent } from './components/add-supervision/add-supervision-modal/add-supervision-modal.component';
import { AddSupervisionComponent } from './components/add-supervision/add-supervision.component';
import { AddEditBaseTheoryComponent } from './components/base-theory/add-edit-base-theory/add-edit-base-theory.component';
import { BaseTheoryListComponent } from './components/base-theory/base-theory-list/base-theory-list.component';
import { CompilationContractCreateComponent } from './components/compilation-contract/compilation-contract-create.component';
import { NajaExpertsSessionEnactmentsComponent } from './components/naja-experts-session/naja-experts-session-enactments/naja-experts-session-enactments.component';
import { NajaExpertsSessionListComponent } from './components/naja-experts-session/naja-experts-session-list/naja-experts-session-list.component';
import { NajaExpertsSessionMembersComponent } from './components/naja-experts-session/naja-experts-session-members/naja-experts-session-members.component';
import { NajaExpertsSessionComponent } from './components/naja-experts-session/naja-experts-session.component';
import { PaymentComponent } from './components/payment/payment.component';
import { ProposalCreateComponent } from './components/proposal/proposal-create.component';
import { CertificateStatusListComponent } from './components/regulations-certificate/certificate-status-list/certificate-status-list.component';
import { CertificateStatusComponent } from './components/regulations-certificate/certificate-status/certificate-status.component';
import { CertificateViewDialogComponent } from './components/regulations-certificate/certificate-view-dialog/certificate-view-dialog.component';
import { CreateCertificationDynamicFormComponent } from './components/regulations-certificate/create-certification-dynamic-form/create-certification-dynamic-form.component';
import { RegulationsCertificateCreateComponent } from './components/regulations-certificate/regulations-certificate-create.component';
import { RegulationsListComponent } from './components/regulations-list/regulations-list.component';
import { RfpAttachFileComponent } from './components/rfp/rfp-attach-file/rfp-attach-file.component';
import { RfpCreateComponent } from './components/rfp/rfp-create/rfp-create.component';
import { SessionMemberDutyEditComponent } from './components/session-planning/session-member-duty-edit/session-member-duty-edit.component';
import { SessionPlanningEditComponent } from './components/session-planning/session-planning-edit/session-planning-edit.component';
import { SessionPlanningListComponent } from './components/session-planning/session-planning-list/session-planning-list.component';
import { SpecializedTeamCreateComponent } from './components/specialized-team/specialized-team-create.component';
import { SpecializedTeamEditComponent } from './components/specialized-team/specialized-team-edit/specialized-team-edit.component';
import { SpecializedTeamModalComponent } from './components/specialized-team/specialized-team-modal/specialized-team-modal.component';
import { SupervisionContractCreateComponent } from './components/supervision-contract/supervision-contract-create.component';
import { ExternalMemberModalComponent } from './components/target-specification/external-member-modal/external-member-modal.component';
import { TargetSpecificationEditComponent } from './components/target-specification/target-specification-edit/target-specification-edit.component';
import { TargetSpecificationListComponent } from './components/target-specification/target-specification-list/target-specification-list.component';
import { TeamMemberModalComponent } from './components/target-specification/team-member-modal/team-member-modal.component';
import { WorkshopCertificateEditComponent } from './components/workshop-certificate/workshop-certificate-edit/workshop-certificate-edit.component';
import { WorkshopCertificateComponent } from './components/workshop-certificate/workshop-certificate.component';
import { RegulationsRoutingModule } from './regulations-routing.module';
import { PaymentEditComponent } from './components/payment/payment-edit/payment-edit.component';

@NgModule({
  declarations: [
    RegulationsListComponent,
    RegulationsAddEditComponent,
    SupervisionContractCreateComponent,
    CompilationContractCreateComponent,
    ProposalCreateComponent,
    RegulationsCertificateCreateComponent,
    RfpCreateComponent,
    RfpAttachFileComponent,
    SpecializedTeamCreateComponent,
    SpecializedTeamModalComponent,
    CertificateStatusComponent,
    CertificateStatusListComponent,
    NajaExpertsSessionComponent,
    SpecializedTeamEditComponent,
    CreateCertificationDynamicFormComponent,
    NajaExpertsSessionMembersComponent,
    NajaExpertsSessionEnactmentsComponent,
    DatepickerBasicJalaliFormlyComponent,
    CertificateViewDialogComponent,
    NajaExpertsSessionListComponent,
    BaseTheoryListComponent,
    AddEditBaseTheoryComponent,
    AddSupervisionComponent,
    AddSupervisionModalComponent,
    TargetSpecificationEditComponent,
    TargetSpecificationListComponent,
    ExternalMemberModalComponent,
    TeamMemberModalComponent,
    SessionPlanningListComponent,
    SessionPlanningEditComponent,
    AddSupervisionEditComponent,
    WorkshopCertificateComponent,
    WorkshopCertificateEditComponent,
    SessionMemberDutyEditComponent,
    PaymentComponent,
    PaymentEditComponent
  ],
  imports: [
    CommonModule,
    AppSharedModule,
    BasicValueSharedModule,
    ExpertPersonSharedModule,
    RegulationsRoutingModule,
    DataViewModule,
    OrgUnitSharedModule,
    FormlyModule.forRoot({
      types: [
        { name: 'datepicker-jalali-formly', component: DatepickerBasicJalaliFormlyComponent },
      ],
      validationMessages: [
        { name: 'required', message: 'This field is required' },
      ],
    }),
    FormlyPrimeNGModule,
    InputNumberModule,
    WorkflowSharedModule,
    ActivitySharedModule,
    FieldsetModule,
  ]
})
export class RegulationsModule {
}
