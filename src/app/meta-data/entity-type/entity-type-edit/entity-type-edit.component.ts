import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { AcceptComponent } from 'src/app/app-shared/components/accept/accept.component';
import { EntityType } from '../models/entity-type';
import { Field } from '../models/field';
import { EntityTypeService } from '../services/entity-type.service';

@Component({
  selector: 'app-entity-type-edit',
  templateUrl: './entity-type-edit.component.html',
  styleUrls: ['./entity-type-edit.component.scss'],
})
export class EntityTypeEditComponent extends BaseComponent implements OnInit {

  @ViewChild('accept_modal') accept_modal: AcceptComponent;

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

    this.translate.get('action').subscribe(res => {
      this.actionTranslate = res;
    });
  }
  loadData() {

    this.activatedRoute.paramMap.subscribe(p => {
      this.editMode = (this.activatedRoute.snapshot.url[0].path === "edit");
      if (this.editMode) {
        var id = +p.get('id');

        this.service.getEntityType(id).subscribe(res => {
          this.entityType = res;

          if (!this.entityType) {
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

  get name() { return this.form.get('name'); }
  get persianName() { return this.form.get('persianName'); }
  get fields() { return this.form.get('fields'); }
  get actions() { return this.form.get('actions'); }
  get menu() { return this.form.get('menu'); }

  handleError(error: any) {
    this.errorNotify({ detail: 'خطای نا مشخص', summary: 'رخداد خطا' });
    console.error(error);
  }
  updateForm() {
    this.form.controls.name.setValue(this.entityType.name);
    this.form.controls.persianName.setValue(this.entityType.persianName);
    this.form.controls.fields.setValue(this.entityType.fields);
    this.form.controls.actions.setValue(this.entityType.actions);
    this.form.controls.menu.setValue(this.entityType.menu);
  }
  onBack() {
    this._location.back();
  }
  createForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      persianName: ['', [Validators.required]],
      fields: ['', [Validators.required]],
      actions: ['', [Validators.required]],
      menu: [null, [Validators.required]]
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    var entityTypeTemp = <EntityType>{
      name: this.name.value,
      persianName: this.persianName.value,
      fields: this.fields.value,
      actions: this.actions.value,
      menu: this.menu.value
    };

    if (this.editMode) {
      //update
      entityTypeTemp.id = this.entityType.id;

      this.service.put(entityTypeTemp).subscribe(res => {
        this.successNotify({ detail: 'بروزرسانی انجام شد', summary: 'عملیات موفق' });

        this.onBack();
      }, error => {
        this.handleError(error);
      });
    }
    else {
      //insert
      this.service.post(entityTypeTemp).subscribe(res => {
        this.successNotify({ detail: 'عملیات ثبت با موفقیت انجام شد', summary: 'عملیات موفق' });

        this.onBack();
      }, error => {
        this.handleError(error);
      });
    }
  }


  onCreatefields() {
    this.field = null;
    this.fieldsDialog = true;

  }

  Getfield(field: Field) {
    this.entityType.fields.push(field);
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

  getMenuItems(rowNode: Field): MenuItem[] {
    return <MenuItem[]>[
      { label: this.actionTranslate.edit, icon: 'pi pi-pencil', command: () => { this.onEdit(rowNode); } },
      { label: this.actionTranslate.delete, icon: 'pi pi-times', command: () => { this.onDelete(rowNode); } }
    ];
  }

  onEdit(rowNode) {
    this.fieldsDialog = true;
    this.field = rowNode;
    // this.router.navigate(["./", "edit", rowNode.id], { relativeTo: this.activatedRoute });
  }

  onDelete(rowNode) {
    this.accept_modal.show(rowNode.firstName + ' ' + rowNode.lastName + ' حذف شود؟', rowNode);
  }
  delete(rowData) {
    // this.entityService.deleteEntityType(rowData.id).subscribe(res => {
    //   this.msgService.add({ severity: 'success', summary: 'عملیات موفق', detail: 'حذف انجام شد' });

    //   this.entityTypes = this.entityTypes.filter(x => x.id !== rowData.id);
    // }, error => {
    //   this.handleError(error);
    // });
  }
}
