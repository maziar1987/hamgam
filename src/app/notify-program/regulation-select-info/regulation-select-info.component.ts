import {Component, OnInit} from '@angular/core';
import {RegulationsCertificate} from '../../regulations/components/regulations-certificate/regulations-certificate.model';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng';
import {RegulationsService} from '../../regulations/regulations.service';
import {BasicValueService} from '../../basicinfo/basic-value/basic-value.service';
import {BasicValue, BasicValueType} from '../../basicinfo/basic-value/basic-value.model';
import {CertificateView} from '../model/notify-program.model';

@Component({
  selector: 'app-regulation-select-info',
  templateUrl: './regulation-select-info.component.html',
  styleUrls: ['./regulation-select-info.component.scss']
})
export class RegulationSelectInfoComponent implements OnInit {

  certificates: CertificateView [] = [];
  tableDataCertificates: CertificateView [] = [];
  regulationStatusBasicValues: BasicValue;
  regulationTypeBasicValues: BasicValue;
  selectedCertificates: CertificateView [] = [];
  loading: boolean;

  constructor(public ref: DynamicDialogRef,
              public certificateService: RegulationsService,
              public config: DynamicDialogConfig,
              public basicValueService: BasicValueService) {
    this.basicValueService.getBasicInfo(BasicValueType.regulationStatus).subscribe(values => {
      this.regulationStatusBasicValues = values;
    });
    this.basicValueService.getBasicInfo(BasicValueType.regulationType).subscribe(values => {
      this.regulationTypeBasicValues = values;
    });
  }

  ngOnInit(): void {
    if (this.config.data) {
      this.loadData(this.config.data.orgUnitId, this.config.data?.selections);
    }
  }

  onSelect() {
    this.ref.close(this.selectedCertificates);
  }

  loadData(orgUnitId: number, selections: CertificateView[]) {
    let exist;
    this.loading = true;
    this.certificateService.getByProducerId(orgUnitId).subscribe(certificates => {
      certificates.forEach(value => {
        const certificate = {
          id: value.id,
          title: value.title,
          status: this.regulationStatusBasicValues.children.find(x => x.id = value.lastStatus.statusId).title,
          type: this.regulationTypeBasicValues.children.find(x => x.id = value.lastStatus.statusId).title,
          description: null,
          certificateId: value.id,
          notifyId: null,
          registerNo: null,
          code: null
        } as CertificateView;
        if (this.config.data.selections) {
          exist = selections.find(x => x.id === value.id);
          if (exist) {
            certificate.selected = 'checked';
          }
        }
        this.certificates.push(certificate);
        this.tableDataCertificates.push(certificate);
      });
      this.loading = false;
      if (this.config.data.selections) {
        this.selectedCertificates = JSON.parse(JSON.stringify(selections));
      }
    });
  }

  onCancel() {
    this.ref.close(null);
  }

  itemCheckedClick(item: any, event) {
    if (event.checked) {
      this.selectedCertificates.push({
        id: item.id,
        certificateId: item.certificateId,
        notifyId: null,
        type: item.type,
        status: item.status,
        title: item.title,
        description: null,
        selected: null,
        code: item.code,
        registerNo: item.registerNo
      });
    } else {
      this.selectedCertificates = this.selectedCertificates.filter(x => x.id !== item.id);
    }
  }

  filterGlobal(event) {
    if (event.length >= 3) {
      event = event.replace(/\u0643/g, '\u06A9'); // ک
      event = event.replace(/\u0649/g, '\u064A'); // ی
      event = event.replace(/\u06CC/g, '\u064A'); // ی
      this.tableDataCertificates = this.certificates.filter(x => x.title.includes(event));
    } else if (event.length <= 0) {
      this.tableDataCertificates = this.certificates;
    }
  }

}
