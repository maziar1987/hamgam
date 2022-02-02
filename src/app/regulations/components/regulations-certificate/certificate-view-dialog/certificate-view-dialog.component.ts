import {Component, OnInit} from '@angular/core';
import {FormContainerChildBaseComponent} from '../../../../form-container/models/form-container-child-base-component';
import {BasicValue, BasicValueType} from '../../../../basicinfo/basic-value/basic-value.model';
import {BasicValueService} from '../../../../basicinfo/basic-value/basic-value.service';
import {Orgunit} from '../../../../basicinfo/orgunit/orgunit.model';
import {OrgunitService} from '../../../../basicinfo/orgunit/orgunit.service';
import {RegulationsCertificate} from '../regulations-certificate.model';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng';
import {RegulationCertificateService} from '../regulation-certificate.service';
import {FormBuilder, Validators} from '@angular/forms';
import {BaseComponent} from '../../../../app-shared/base/base.component';

@Component({
  selector: 'app-certificate-view-dialog',
  templateUrl: './certificate-view-dialog.component.html',
  styleUrls: ['./certificate-view-dialog.component.scss']
})
export class CertificateViewDialogComponent extends BaseComponent implements OnInit {

  selectedBasicValueType: BasicValue;
  compilationStatusValue: BasicValue[] = [];
  applicationBasicLevelId: BasicValue[] = [];
  applicationBasicAreaId: BasicValue[] = [];
  selectedProducer: Orgunit;
  certificate: RegulationsCertificate;
  lastStatus = '';
  selectedArea: any;
  selectedCompilation: any;
  selectedLevel: any;

  constructor(private basicValueService: BasicValueService,
              public ref: DynamicDialogRef,
              public config: DynamicDialogConfig,
              private certificateService: RegulationCertificateService,
              private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [''],
      unitId: [null],
      title: [null],
      regulationTypeId: [null],
      registerNo: [null],
      code: [null],
      confidentialityId: [null],
      compilationStatusId: [null],
      producerId: [null],
      confirmerId: [null],
      applicationLevelId: [null],
      applicationAreaId: [null],
      certificateStatus: [null]
    });
    this.radioButtonValue();
    if (this.config.data) {
      this.certificateService.getCertificate(this.config.data.certificateId).subscribe(certificate => {
        this.certificate = certificate;
        this.updateForm();
        this.getLastStatus();
      });
    }
  }

  updateForm() {
    this.form.controls.title.setValue(this.certificate.title);
    this.form.controls.regulationTypeId.setValue(this.certificate.regulationTypeId);
    this.form.controls.registerNo.setValue(this.certificate.registerNo);
    this.form.controls.code.setValue(this.certificate.code);
    this.form.controls.confidentialityId.setValue(this.certificate.confidentialityId);
    this.form.controls.compilationStatusId.setValue(this.certificate.compilationStatusId);
    this.form.controls.confirmerId.setValue(this.certificate.confirmerId);
    this.form.controls.applicationLevelId.setValue(this.certificate.applicationLevelId);
    this.form.controls.applicationAreaId.setValue(this.certificate.applicationAreaId);
    this.orgUnitService.getOrgUnit(this.certificate.producerId).subscribe(res => {
      this.selectedProducer = res;
    });
  }

  getBasicValueType(basicValueType: string) {
    return BasicValueType[basicValueType];
  }

  selectBasicValueType(event: BasicValue) {
    this.selectedBasicValueType = event;
  }

  radioButtonValue() {
    this.basicValueService.getBasicInfo(BasicValueType.compilationStatusId).subscribe(basicValue => {
      this.compilationStatusValue = basicValue.children;
      this.selectedCompilation = this.compilationStatusValue[0].id;
    });

    this.basicValueService.getBasicInfo(BasicValueType.applicationLevel).subscribe(basicValue => {
      this.applicationBasicLevelId = basicValue.children;
      this.selectedLevel = this.applicationBasicLevelId[0].id;
    });

    this.basicValueService.getBasicInfo(BasicValueType.applicationArea).subscribe(basicValue => {
      this.applicationBasicAreaId = basicValue.children;
      this.selectedArea = this.applicationBasicAreaId[0].id;
    });
  }

  private getLastStatus() {
    const statusId = this.certificate.lastStatus.statusId;
    this.basicValueService.getBasicInfo(statusId).subscribe(basicValue => {
      this.lastStatus = basicValue.title;
    });
  }

  onCancel() {
    this.ref.close(null);
  }

}
