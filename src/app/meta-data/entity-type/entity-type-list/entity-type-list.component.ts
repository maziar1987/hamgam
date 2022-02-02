import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { AcceptComponent } from 'src/app/app-shared/components/accept/accept.component';
import { utils } from 'src/app/app-shared/utils';
import { EntityType } from '../models';
import { EntityTypeService } from '../services/entity-type.service';

@Component({
  selector: 'app-entity-type-list',
  templateUrl: './entity-type-list.component.html',
  styleUrls: ['./entity-type-list.component.scss']
})
export class EntityTypeListComponent extends BaseComponent implements OnInit {

  @ViewChild('accept_modal') accept_modal: AcceptComponent;

  cols: any[];
  loading: boolean = false;
  utils: any;
  entityTypes: EntityType[] = [];
  selectedEntityType: EntityType;

  actionTranslate: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private entityService: EntityTypeService) {
    super();
  }

  ngOnInit(): void {
    this.utils = utils;
    this.loadData();
    this.setColumns();

    this.translate.get('action').subscribe(res => {
      this.actionTranslate = res;
    });
  }

  setColumns() {
    this.translate.get('entityType').subscribe(res => {
      this.cols = [
        { field: 'name', header: res.name },
        { field: 'persianName', header: res.persianName }
      ];
    });
  }

  loadData() {
    this.loading = true;
    this.entityService.getEntityTypes().subscribe(entityTypes => {
      this.loading = false;
      this.entityTypes = entityTypes;
    }, error => {
      this.loading = false;
      this.handleError(error);
    });
  }

  getMenuItems(rowNode: EntityType): MenuItem[] {
    return <MenuItem[]>[
      { label: this.actionTranslate.view, icon: 'pi pi-info', command: () => { this.onView(rowNode); } },
      { label: this.actionTranslate.edit, icon: 'pi pi-pencil', command: () => { this.onEdit(rowNode); } },
      { label: this.actionTranslate.delete, icon: 'pi pi-times', command: () => { this.onDelete(rowNode); } }
    ];
  }

  onRowSelect(event) {
    // this.selectedEntityInfos = event;
  }

  onView(rowNode) {
    this.router.navigate(["./", rowNode.id], { relativeTo: this.activatedRoute });
  }

  onCreate() {
    this.router.navigate(["./", "create"], { relativeTo: this.activatedRoute });
  }

  onEdit(rowNode) {
    this.router.navigate(["./", "edit", rowNode.id], { relativeTo: this.activatedRoute });
  }

  onDelete(rowNode) {
    this.accept_modal.show(rowNode.firstName + ' ' + rowNode.lastName + ' حذف شود؟', rowNode);
  }

  delete(rowData) {
    this.entityService.deleteEntityType(rowData.id).subscribe(res => {
      this.successNotify({ detail: 'عملیات حذف با موفقیت انجام شد', summary: 'عملیات موفق' });

      this.entityTypes = this.entityTypes.filter(x => x.id !== rowData.id);
    }, error => {
      this.handleError(error);
    });
  }

  handleError(error: any) {
    throw new Error('Method not implemented.');
  }

}
