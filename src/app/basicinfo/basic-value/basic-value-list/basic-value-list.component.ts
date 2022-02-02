import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem, TreeNode } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { AcceptComponent } from 'src/app/app-shared/components/accept/accept.component';
import { LoggerService } from 'src/app/app-shared/services/logger.service';
import { Pagination } from '../../../app-shared/base/pagination.model';
import { BasicValueCreateComponent } from '../basic-value-create/basic-value-create.component';
import { BasicValueDetailComponent } from '../basic-value-detail/basic-value-detail.component';
import { BasicValueEditComponent } from '../basic-value-edit/basic-value-edit.component';
import { BasicValue } from '../basic-value.model';
import { BasicValueService } from '../basic-value.service';

@Component({
  selector: 'app-basic-value-list',
  templateUrl: './basic-value-list.component.html',
  styleUrls: ['./basic-value-list.component.scss'],
  providers: [DialogService]
})
export class BasicValueListComponent extends BaseComponent implements OnInit {

  @ViewChild('accept_modal') accept_modal: AcceptComponent;

  cols: any[];
  loading: boolean;

  basicInfos: BasicValue[] = [];
  selectedBasicValue: BasicValue;
  basicInfosParentId: number | null;
  basicInfosTreeNodes: TreeNode[];
  isShow = false;
  items: MenuItem[] = [];

  ref: DynamicDialogRef;

  page = 0;
  rows = 10;
  first = 0;
  totalRecords = 0;

  constructor(
    public dialogService: DialogService,
    private logger: LoggerService,
    private service: BasicValueService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.createTable();
    this.creatPath();
  }

  creatPath(): void {
    this.items = [];
    this.items.push({ label: 'ریشه', id: null });
  }

  showChildes(basicValue: BasicValue) {
    this.showChildesPagination(basicValue, { page: 0, size: 10, sort: ['title,asc'] });
  }

  showChildesPagination(basicValue: BasicValue, pagination: Pagination) {
    this.items = [];
    this.service.getRoot(basicValue.id).subscribe(basicValues => {
      this.totalRecords = basicValues.find(x => x.id = basicValue.id).children.length;
      this.creatPath();
      for (let i = basicValues.length - 1; i >= 0; i--) {
        this.items.push({ label: basicValues[i].title, id: basicValues[i].id.toString() });
      }
    });
    this.isShow = false;
    this.service.getByParentId(basicValue.id, pagination).subscribe(childes => {
      this.basicInfos = childes;
      this.selectedBasicValue = basicValue;
      this.isShow = true;
    });
  }

  createTable() {
    this.setTotalRecord();
    this.loadBasicValues();
    this.setColumns();
  }

  setTotalRecord() {
    this.service.getBasicValueCount().subscribe(count => {
      this.totalRecords = count;
    }, error => {
      console.error(error);
    });
  }

  loadBasicValues(): void {
    this.loading = true;
    this.service.loadBasicValues(this.pagination).subscribe(basicValues => {
      this.basicInfos = basicValues;
      this.selectedBasicValue = null;
      this.loading = false;
    });
  }

  createTreeTable(basicInfos: BasicValue[], parentNode: TreeNode = null) {
    if (!parentNode) {
      this.basicInfosTreeNodes = [];
      basicInfos.forEach(basicInfo => {
        const newNode = this.getNewTreeNode(basicInfo);
        this.basicInfosTreeNodes = [...this.basicInfosTreeNodes, newNode];
        this.createTreeTable(basicInfo.children, newNode);
      });
    } else {
      const children = basicInfos.filter(x => x.parentId === parentNode.data.id);
      children.forEach(basicInfo => {
        const newNode = this.getNewTreeNode(basicInfo, parentNode);
        parentNode.children = [...parentNode.children, newNode];
        this.createTreeTable(basicInfo.children, newNode);
      });
    }
  }

  getNewTreeNode(basicInfo: BasicValue, parentNode: TreeNode = null): TreeNode {
    return {
      data: basicInfo,
      leaf: basicInfo.children.length <= 0,
      expanded: false,
      children: [],
      parent: parentNode
    } as TreeNode;
  }

  handleError(error: any, id?: number) {

    if (error instanceof HttpErrorResponse) {

      this.logger.error(error);
    }
  }

  getMenuItems(basicValue: BasicValue): MenuItem[] {
    const items = [
      {
        label: 'مشاهده', icon: 'pi pi-info', command: () => {
          this.onView(basicValue);
        }
      }, {
        label: 'ویرایش', icon: 'pi pi-pencil', command: () => {
          this.onUpdate(basicValue);
        }
      }
    ] as MenuItem[];
    if (basicValue.parentId != null) {
      items.push({
        label: 'حذف', icon: 'pi pi-times', command: () => {
          this.onDelete(basicValue);
        }
      });
    }

    return items;
  }

  setColumns() {
    // var str = this.localizationService.instant('HitX::appOwner');
    this.cols = [
      { field: 'title', header: 'مقدار' },
      { field: 'status', header: 'فعال' }
    ];
  }

  onView(basicValue: BasicValue) {
    this.ref = this.dialogService.open(BasicValueDetailComponent, {
      // header: 'مشاهده',
      data: { id: basicValue.id },
      width: '70%',
      contentStyle: { 'max-height': '650px', overflow: 'auto', direction: 'rtl', 'text-align': 'right' }
    });

    this.ref.onClose.subscribe((car: string) => {
      if (car) {
      }
    });
  }

  onCreate() {
    this.ref = this.dialogService.open(BasicValueCreateComponent, {
      data: { id: this.selectedBasicValue.id },
      closable: false,
      width: '70%',
      contentStyle: { 'max-height': '650px', overflow: 'auto', direction: 'rtl', 'text-align': 'right' }
    });
    this.ref.onClose.subscribe((basicvaluses: BasicValue[]) => {
      if (basicvaluses) {
        basicvaluses.forEach(basic => {
          this.basicInfos.push(basic);
        });
      }
    });
  }

  onUpdate(basicValue: BasicValue) {
    if (!basicValue.readonly) {
      // this.router.navigate(["./", "edit", rowNode.node.data.id], { relativeTo: this.activatedRoute });


      this.ref = this.dialogService.open(BasicValueEditComponent, {
        // header: 'مشاهده',
        data: { id: basicValue.id },
        width: '70%',
        contentStyle: { 'max-height': '650px', overflow: 'auto', direction: 'rtl', 'text-align': 'right' }
      });
      this.ref.onClose.subscribe((basicvalue: BasicValue) => {
        if (basicvalue) {
          this.basicInfos.forEach(value => {
            if (value.id === basicvalue.id) {
              value.title = basicvalue.title;
              value.status = basicvalue.status;
            }
          });
        }
      });

    } else {
      this.errorNotify({ detail: 'امکان ویرایش برای مقادیر ثابت وجود ندارد', summary: 'رویداد خطا' });
    }
  }

  searchTreeNodes(basicvalue: TreeNode[], id: number) {
    let result;
    const element = basicvalue.find(x => x.data.id === id);
    if (element) {
      return element;
    } else {
      basicvalue.forEach(value => {
        if (value.children.length > 0 && !result) {
          result = this.searchTreeNodes(value.children, id);
          if (result) {
            return result;
          }
        }
        return result;
      });
    }
    return result;
  }

  onDelete(basicValue: BasicValue) {
    if (!basicValue.readonly) {
      this.accept_modal.show(basicValue.title + ' حذف شود؟', basicValue);
    } else {
      this.errorNotify({ detail: 'امکان حذف برای مقادیر ثابت وجود ندارد', summary: 'رویداد خطا' });
    }
  }

  delete(basicValue: BasicValue) {
    if (!basicValue.readonly) {
      this.service.deleteBasicInfo(basicValue.id).subscribe(res => {
        this.infoNotify({ detail: 'حذف انجام شد', summary: 'اطلاع ' });
        this.basicInfos = this.basicInfos.filter(x => x.id !== basicValue.id);
      }, error => {
        this.handleError(error);
      });
    }
  }

  filterGlobal(event) {
    if (event.length >= 3) {
      event = event.replace(/\u0643/g, '\u06A9'); // ک
      event = event.replace(/\u0649/g, '\u064A'); // ی
      event = event.replace(/\u06CC/g, '\u064A'); // ی
      this.service.searchByTitle(event, { page: 0, size: 10, sort: ['title,asc'] }).subscribe(res => {
        this.basicInfos = res.data;
        this.totalRecords = res.totalCount;
        this.loading = false;
      });
    } else if (event.length <= 0) {
      this.loadBasicValues();
    }
  }

  pathClick(event) {
    let changeItems = [];
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].id === event.item.id) {
        changeItems.push(event.item);
        break;
      } else {
        changeItems.push(this.items[i]);
      }
    }
    this.items = changeItems;
    this.loadData(event.item);
  }

  loadData(basicValue: BasicValue): void {
    this.loading = true;
    if (!basicValue.id) {
      this.loadBasicValues();
      this.setTotalRecord();
    } else {
      this.service.getByParent(basicValue.id).subscribe(basicValues => {
        this.basicInfos = basicValues;
        this.loading = false;
        this.totalRecords = this.basicInfos.length;
      });
      this.selectedBasicValue = basicValue;
    }
  }

  get pagination(): Pagination {
    return { page: this.page, size: this.rows, sort: ['title,asc'] };
  }

  onPageChange(event) {
    // event.first = Index of the first record
    // event.rows = Number of rows to display in new page
    // event.page = Index of the new page
    // event.pageCount = Total number of pages
    if (!this.isShow) {
      this.page = event.page;
      this.rows = event.rows;
      if (this.selectedBasicValue) {
        this.showChildesPagination(this.selectedBasicValue, { page: event.page, size: 10, sort: ['title,asc'] });
      } else {
        this.loadBasicValues();
      }
    } else {
      if (this.selectedBasicValue) {
        this.showChildesPagination(this.selectedBasicValue, { page: event.page, size: 10, sort: ['title,asc'] });
      } else {
        this.loadBasicValues();
      }
    }
    this.isShow = false;
  }
}
