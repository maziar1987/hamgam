import {Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';
import {RegulationCertificateDynamicFormService} from './regulation-certificate-dynamic-form.service';

@Component({
  selector: 'app-regulations-certificate-dynamic-form',
  templateUrl: './create-certification-dynamic-form.component.html',
  styleUrls: ['./create-certification-dynamic-form.component.scss']
})
export class CreateCertificationDynamicFormComponent implements OnInit {
  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [];

  constructor(private service: RegulationCertificateDynamicFormService) {

  }

  ngOnInit() {
    this.getCertificateSchemaForm();
  }

  getCertificateSchemaForm() {
    this.service.getCertificate().subscribe(result => {
      this.fields = result;
    });
  }
}
