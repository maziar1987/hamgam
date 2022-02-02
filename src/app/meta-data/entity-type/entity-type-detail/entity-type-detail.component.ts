import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { EntityType } from '../models/entity-type';
import { Field } from '../models/field';
import { EntityTypeService } from '../services/entity-type.service';

@Component({
  selector: 'app-entity-type-detail',
  templateUrl: './entity-type-detail.component.html',
  styleUrls: ['./entity-type-detail.component.scss']
})
export class EntityTypeDetailComponent extends BaseComponent implements OnInit {

  cols: any[];
  editMode: boolean = false;
  entityType: EntityType;
  private _location: Location;
  public fieldsDialog: boolean;
  public field: Field;
  actionTranslate: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private service: EntityTypeService,
    private fb: FormBuilder,
    private location: Location
  ) {
    super();
    this._location = location;
  }

  ngOnInit(): void {
    this.createForm();
    this.loadData();
    this.setColumns();
  }
  setColumns() {
    this.translate.get('field').subscribe(res => {
      this.cols = [
        { field: 'name', header: res.name },
        { field: 'persianName', header: res.persianName },
        { field: 'valueType', header: res.valueType },
        { field: 'mainValue', header: res.mainValue },
        { field: 'defaultValue', header: res.defaultValue },
        { field: 'required', header: res.required }
      ];
    });
  }
  loadData() {
    this.activatedRoute.paramMap.subscribe(p => {
      this.editMode = (this.activatedRoute.snapshot.url[0].path === "edit");
      if (!this.editMode) {
        var id = +p.get('id');

        this.service.getEntityType(id).subscribe(res => {
          this.entityType = res;

          if (!this.entityType) {
            this.warningNotify({ summary: 'اخطار', detail: 'اطلاعاتی وجود ندارد' });
            this.onBack();
          }

          this.updateForm();
        }, error => {
          this.handleError(error);
        });
      }
    });
  }
  createForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      persianName: ['', [Validators.required]],
      fields: ['', [Validators.required]],
      actions: ['', [Validators.required]]
    });
  }
  get name() { return this.form.get('name'); }
  get persianName() { return this.form.get('persianName'); }
  get fields() { return this.form.get('fields'); }
  get actions() { return this.form.get('actions'); }


  updateForm() {
    this.form.controls.name.setValue(this.entityType.name);
    this.form.controls.persianName.setValue(this.entityType.persianName);
    this.form.controls.fields.setValue(this.entityType.fields);
    this.form.controls.actions.setValue(this.entityType.actions);

  }
  onBack() {
    this._location.back();
  }
  handleError(error: any) {
    this.errorNotify({ summary: 'رخداد خطا', detail: 'خطای نا مشخص' });
    console.error(error);
  }

}
