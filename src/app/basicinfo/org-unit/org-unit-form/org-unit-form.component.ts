import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TreeNode } from 'primeng';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BaseComponent } from '../../../app-shared/base/base.component';
import { AcceptComponent } from '../../../app-shared/components/accept/accept.component';
import { OrgUnit } from '../models/org-unit';
import { OrgUnitEditComponent } from '../org-unit-edit/org-unit-edit.component';
import { OrgUnitService } from '../services/org-unit.service';

@Component({
  selector: 'app-org-unit-form',
  templateUrl: './org-unit-form.component.html',
  styleUrls: ['./org-unit-form.component.scss']
})
export class OrgUnitFormComponent extends BaseComponent implements OnInit {

  @ViewChild('accept_modal') accept_modal: AcceptComponent;
  // tslint:disable-next-line:variable-name
  private _orgUnitTreeNode: TreeNode;
  @Input()
  get orgUnitTreeNode(): TreeNode {
    return this._orgUnitTreeNode;
  }

  set orgUnitTreeNode(node: TreeNode) {
    this._orgUnitTreeNode = node;
    this.loadData(this._orgUnitTreeNode?.data?.id);
  }

  @Output() deletedNode: EventEmitter<OrgUnit> = new EventEmitter<OrgUnit>();
  @Output() addNode: EventEmitter<OrgUnit> = new EventEmitter<OrgUnit>();

  orgUnit: OrgUnit;
  childOrgUnits: OrgUnit[] = [];
  loading: boolean;
  ref: DynamicDialogRef;

  constructor(public orgUnitService: OrgUnitService,
    private fb: FormBuilder,
    public dialogService: DialogService) {
    super();
  }

  ngOnInit(): void {
    this.createForm();
    const orgUnitId = this._orgUnitTreeNode?.data?.id;
    this.loadData(orgUnitId);
  }

  loadData(orgUnitId: number) {
    if (orgUnitId) {
      this.orgUnitService.getOrgUnit(orgUnitId).subscribe(res => {
        this.orgUnit = res;
        this.updateForm();
        this.loading = true;
        this.getChild();
      });
    }
  }

  getChild() {
    this.orgUnitService.getOrgUnitByParent({ parentId: this.orgUnit.id }).subscribe(orgUnits => {
      this.childOrgUnits = orgUnits.filter(x => x.activated);
      this.loading = false;
    }, error => {
      console.error(error);
    });
  }

  createForm() {
    this.form = this.fb.group({
      displayName: ['', [Validators.required]],
      code: [''],
      viewOrder: [null],
      activated: [true, [Validators.required]]
    });
  }

  updateForm() {
    this.form.controls.displayName.setValue(this.orgUnit?.displayName);
    this.form.controls.code.setValue(this.orgUnit?.code);
    this.form.controls.activated.setValue(this.orgUnit?.activated);
    this.form.controls.viewOrder.setValue(this.orgUnit?.viewOrder);
  }

  addOrgUnit() {
    this.ref = this.dialogService.open(OrgUnitEditComponent, {
      data: { parentId: this.orgUnit.id },
      width: '70%',
      contentStyle: { 'max-height': '650px', overflow: 'auto', direction: 'rtl', 'text-align': 'right' }
    });
    this.ref.onClose.subscribe((orgUnit: OrgUnit) => {
      if (orgUnit !== null) {
        this.successNotify({ detail: 'ثبت با موفقیت انجام شد.', summary: 'عملیات موفق' });
        this.childOrgUnits.push(orgUnit);
        this.loadData(orgUnit.id);
        this.addNode.emit(orgUnit);
      }
    });
  }

  onSubmit() {
    const prop = {
      id: this.orgUnit.id,
      displayName: this.displayName.value,
      activated: this.activated.value,
      code: this.code.value,
      viewOrder: this.viewOrder.value,
      parentId: this.orgUnit.parentId
    } as OrgUnit;
    this.orgUnitService.put(prop).subscribe(orgUnit => {
      this.orgUnit = orgUnit;
      this.successNotify({ detail: 'تغییرات ذخیره گردید.', summary: 'عملیات موفق' });
    });
  }

  onDelete() {
    if (this.childOrgUnits.length <= 0) {
      this.accept_modal.show(this.orgUnit.displayName + ' حذف شود؟', this.orgUnit);
    } else {
      this.warningNotify({ detail: 'امکان حذف این آیتم را ندارد. دارای زیر مجموعه می باشد.', summary: 'عملیات ناموفق' });
    }
  }

  delete(orgUnit: OrgUnit) {
    this.orgUnitService.deleteOrgUnit(orgUnit.id).subscribe(value => {
      this.deletedNode.emit(this.orgUnit);
      this.loadData(this.orgUnit.parentId);
    }, error => {
      this.warningNotify({ detail: 'امکان حذف این آیتم را ندارد. دارای رابطه می باشد.', summary: 'عملیات ناموفق' });
    });
  }

  get displayName() {
    return this.form.get('displayName');
  }

  get code() {
    return this.form.get('code');
  }

  get activated() {
    return this.form.get('activated');
  }

  get viewOrder() {
    return this.form.get('viewOrder');
  }

}

