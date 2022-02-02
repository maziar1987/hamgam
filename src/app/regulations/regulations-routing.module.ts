import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegulationsAddEditComponent } from './components/add-edit/regulations-add-edit.component';
import { AddEditBaseTheoryComponent } from './components/base-theory/add-edit-base-theory/add-edit-base-theory.component';
import { BaseTheoryListComponent } from './components/base-theory/base-theory-list/base-theory-list.component';
import { CompilationContractCreateComponent } from './components/compilation-contract/compilation-contract-create.component';
import { NajaExpertsSessionListComponent } from './components/naja-experts-session/naja-experts-session-list/naja-experts-session-list.component';
import { NajaExpertsSessionComponent } from './components/naja-experts-session/naja-experts-session.component';
import { ProposalCreateComponent } from './components/proposal/proposal-create.component';
import { CertificateStatusListComponent } from './components/regulations-certificate/certificate-status-list/certificate-status-list.component';
import { CreateCertificationDynamicFormComponent } from './components/regulations-certificate/create-certification-dynamic-form/create-certification-dynamic-form.component';
import { RegulationsCertificateCreateComponent } from './components/regulations-certificate/regulations-certificate-create.component';
import { RegulationsListComponent } from './components/regulations-list/regulations-list.component';
import { RfpCreateComponent } from './components/rfp/rfp-create/rfp-create.component';
import { SessionPlanningEditComponent } from './components/session-planning/session-planning-edit/session-planning-edit.component';
import { SessionPlanningListComponent } from './components/session-planning/session-planning-list/session-planning-list.component';
import { SpecializedTeamCreateComponent } from './components/specialized-team/specialized-team-create.component';
import { SupervisionContractCreateComponent } from './components/supervision-contract/supervision-contract-create.component';
import { TargetSpecificationEditComponent } from './components/target-specification/target-specification-edit/target-specification-edit.component';
import { TargetSpecificationListComponent } from './components/target-specification/target-specification-list/target-specification-list.component';
import { WorkshopCertificateEditComponent } from './components/workshop-certificate/workshop-certificate-edit/workshop-certificate-edit.component';
import { WorkshopCertificateComponent } from './components/workshop-certificate/workshop-certificate.component';

const routes: Routes = [
  { path: 'list', component: RegulationsListComponent },
  { path: 'add-edit', component: RegulationsAddEditComponent },
  { path: 'add-edit/:type', component: RegulationsAddEditComponent },
  {
    path: 'add-edit/:type/:id', component: RegulationsAddEditComponent,
    children: [
      { path: 'status-list/:id', component: CertificateStatusListComponent },
      { path: 'certificate', component: RegulationsCertificateCreateComponent },
      { path: 'certificate-dynamic', component: CreateCertificationDynamicFormComponent },
      { path: 'compilation-contract', component: CompilationContractCreateComponent },
      { path: 'proposal', component: ProposalCreateComponent },
      { path: 'rfp', component: RfpCreateComponent },
      { path: 'specialized-team', component: SpecializedTeamCreateComponent },
      { path: 'supervision-contract', component: SupervisionContractCreateComponent },
      { path: 'naja-experts-session-list', component: NajaExpertsSessionListComponent },
      { path: 'naja-experts-session', component: NajaExpertsSessionComponent },
      { path: 'base-theory-list', component: BaseTheoryListComponent },
      { path: 'base-theory', component: AddEditBaseTheoryComponent },
      { path: 'workshop-certificate', component: WorkshopCertificateComponent },
      { path: 'workshop-edit', component: WorkshopCertificateEditComponent },
      { path: 'payment-edit', component: WorkshopCertificateEditComponent },
      { path: 'target-specification', component: TargetSpecificationListComponent },
      { path: 'target-specification-edit/:id', component: TargetSpecificationEditComponent },
      { path: 'session-planning', component: SessionPlanningListComponent },
      { path: 'session-planning-edit/:id', component: SessionPlanningEditComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegulationsRoutingModule {
}
