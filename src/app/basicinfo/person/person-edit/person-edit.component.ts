import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TreeNode } from 'primeng';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { BasicValueType } from '../../basic-value/basic-value.model';
import { OrgUnit } from '../../org-unit/models/org-unit';
import { Person } from '../models/person';
import { PersonEdit } from '../models/person-edit';
import { PersonService } from '../services/person.service';

@Component({
  selector: 'app-person-edit',
  templateUrl: './person-edit.component.html',
  styleUrls: ['./person-edit.component.scss'],
})
export class PersonEditComponent extends BaseComponent implements OnInit {

  filter: boolean = true;
  editMode: boolean = false;
  private _location: Location;
  person: Person;
  selectedOrganization: OrgUnit;
  selectedNode: TreeNode;
  displayOrgUnitTree: boolean = false;

  constructor(
    private location: Location,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private service: PersonService) {
    super();

    this._location = location;
  }

  ngOnInit(): void {
    this.createForm();
    this.loadData();
  }

  loadData() {
    this.activatedRoute.paramMap.subscribe(p => {
      this.editMode = (this.activatedRoute.snapshot.url[0].path === "edit");
      if (this.editMode) {
        var id = +p.get('id');

        this.service.getPerson(id).subscribe(res => {
          this.person = res;

          if (!this.person) {
            this.warningNotify({ detail: 'اطلاعاتی وجود ندارد', summary: 'اخطار' });
            this.onBack();
          }

          this.updateForm();
        }, error => {
          this.handleError(error);
        });
      }
    });
  }

  get personnelCode() { return this.form.get('personnelCode') }
  get nationalCode() { return this.form.get('nationalCode') }
  get firstName() { return this.form.get('firstName') }
  get lastName() { return this.form.get('lastName') }
  get fatherName() { return this.form.get('fatherName') }
  get birthDate() { return this.form.get('birthDate') }
  get educationDegreeId() { return this.form.get('educationDegreeId') }
  get organizationId() { return this.form.get('organizationId') }
  get employmentDate() { return this.form.get('employmentDate') }
  get rankId() { return this.form.get('rankId') }
  get studyFieldId() { return this.form.get('studyFieldId') }

  createForm() {
    this.form = this.fb.group({
      lastName: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      nationalCode: ['', [Validators.required]],
      fatherName: ['', [Validators.required]],
      birthDate: [null, [Validators.required]],
      educationDegreeId: [null, [Validators.required]],
      organizationId: '',
      employmentDate: [null],
      rankId: [null, [Validators.required]],
      studyFieldId: [null, [Validators.required]],
      personnelCode: ['', [Validators.required]]
    });
  }

  updateForm() {
    this.form.controls.lastName.setValue(this.person.lastName);
    this.form.controls.firstName.setValue(this.person.firstName);
    this.form.controls.nationalCode.setValue(this.person.nationalCode);
    this.form.controls.fatherName.setValue(this.person.fatherName);
    if (this.person.birthDate) {
      var birthDateTemp = this.person.birthDate.toString();
      var birthDate = new Date(Date.UTC(+birthDateTemp.split('T')[0].split('-')[0], +birthDateTemp.split('T')[0].split('-')[1] - 1, +birthDateTemp.split('T')[0].split('-')[2]));

      this.form.controls.birthDate.setValue(birthDate);
    }

    this.form.controls.educationDegreeId.setValue(this.person.educationDegreeId);
    this.form.controls.organizationId.setValue(this.person.organizationId);
    if (this.person.organizationId) {
      this.orgUnitService.getOrgUnit(this.person.organizationId).subscribe(res => {
        this.selectedOrganization = res;
      }, error => {
        this.handleError(error);
      });
    }

    if (this.person.employmentDate) {
      var employmentDateTemp = this.person.employmentDate.toString();
      var employmentDate = new Date(Date.UTC(+employmentDateTemp.split('T')[0].split('-')[0], +employmentDateTemp.split('T')[0].split('-')[1] - 1, +employmentDateTemp.split('T')[0].split('-')[2]));

      this.form.controls.employmentDate.setValue(employmentDate);
    }

    this.form.controls.rankId.setValue(this.person.rankId);
    this.form.controls.studyFieldId.setValue(this.person.studyFieldId);
    this.form.controls.personnelCode.setValue(this.person.personnelCode);
  }

  onBack() {
    this._location.back();
  }

  getBasicValueType(basicValueType: string) {
    return BasicValueType[basicValueType];
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    var personTemp = <PersonEdit>{
      lastName: this.lastName.value,
      firstName: this.firstName.value,
      nationalCode: this.nationalCode.value,
      fatherName: this.fatherName.value,
      birthDate: this.birthDate.value,
      educationDegreeId: this.educationDegreeId.value,
      organizationId: this.organizationId.value,
      employmentDate: this.employmentDate.value,
      rankId: this.rankId.value,
      studyFieldId: this.studyFieldId.value,
      personnelCode: this.personnelCode.value
    };

    if (this.editMode) {
      //update
      personTemp.id = this.person.id;

      this.service.put(personTemp).subscribe(res => {
        this.successNotify({ detail: 'بروزرسانی انجام شد', summary: 'عملیات موفق' });

        this.onBack();
      }, error => {
        this.handleError(error);
      });
    }
    else {
      //insert
      this.service.post(personTemp).subscribe(res => {
        this.successNotify({ detail: 'عملیات موفق', summary: 'عملیات موفق' });

        this.onBack();
      }, error => {
        this.handleError(error);
      });
    }
  }

  showOrgUnitTreeDialog() {
    this.displayOrgUnitTree = true;
  }

  nodeSelect(event: TreeNode) {
    this.selectedNode = event;
  }

  selectOrgUnit() {
    this.selectedOrganization = this.selectedNode.data;
    this.organizationId.setValue(this.selectedOrganization.id);
    this.displayOrgUnitTree = false;
  }

  closeOrgUnitTreeDialog() {
    this.selectedOrganization = null;
    this.organizationId.reset();
    this.displayOrgUnitTree = false;
  }

  handleError(error: any) {
    this.errorNotify({ detail: 'خطای نا مشخص', summary: 'رخداد خطا' });
    console.error(error);
  }

}
