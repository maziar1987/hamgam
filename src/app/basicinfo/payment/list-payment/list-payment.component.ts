import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { AcceptComponent } from 'src/app/app-shared/components/accept/accept.component';
import { PaymentMethod } from '../model/payment-method';
import { PaymentService } from '../payment.service';

@Component({
  selector: 'app-list-payment',
  templateUrl: './list-payment.component.html',
  styleUrls: ['./list-payment.component.scss']
})
export class ListPaymentComponent extends BaseComponent implements OnInit {
  @ViewChild('accept_modal') accept_modal: AcceptComponent;
  payments: PaymentMethod[] = [];
  selectedPayment: PaymentMethod;
  cols: any[];
  loading: boolean;
  constructor(
    private router: Router,
    private paymentService: PaymentService,
    private activatedRoute: ActivatedRoute) { super(); }

  ngOnInit(): void {
    this.setCols();
    this.loadData();

  }
  loadData() {
    this.loading = true;
    this.paymentService.getAll().subscribe(res => {
      this.loading = false;
      this.payments = res;
    }, error => {
      this.loading = false;
    });
  }
  getMenuItems(rowNode: PaymentMethod): MenuItem[] {
    let action: any;
    this.translate.get('action').subscribe(res => {
      action = res;
    });
    var menuItems: MenuItem[] = [
      {
        label: action.edit,
        icon: 'pi pi-pencil',
        command: () => {
          this.onEdit(rowNode);
        }
      },
      {
        label: action.delete,
        icon: 'pi pi-times',
        command: () => {
          this.onDelete(rowNode);
        },
        disabled: rowNode.hasPayment
      }

    ];

    return menuItems;
  }
  onEdit(rowNode: PaymentMethod) {
    this.router.navigate(["./", "edit", rowNode.id], { relativeTo: this.activatedRoute });
  }
  onDelete(rowNode: PaymentMethod) {
    if (rowNode.id) {
      this.accept_modal.show(rowNode.methodName + ' حذف شود؟', rowNode);
    } else {
      this.errorNotify({ detail: 'امکان حذف وجود ندارد', summary: 'رخداد خطا' });
    }
  }
  delete(event) {
    if (event.id) {
      this.paymentService.delete(event.id).subscribe(() => {
        this.successNotify({ detail: 'عملیات حذف با موفقیت انجام شد', summary: 'عملیات موفق' });
        this.loadData();
      }, error => {
        this.errorNotify()
      });
    }
  }
  onCreate() {
    this.router.navigate(["./", "create"], { relativeTo: this.activatedRoute });
  }
  onRowSelect($event) {

  }
  setCols() {
    // this.translate.get('policy').subscribe(policy => {
    this.cols = [
      { field: 'methodName', header: 'نام روش' },
      { field: 'stepsNumber', header: 'تعداد مراحل' },
      { field: 'steps', header: 'مراحل' },
      { field: 'description', header: 'توضیحات' },
      { field: 'status', header: 'وضعیت' },
      { field: 'lastEditDate', header: 'تاریخ آخرین ویرایش' },

    ];
    // });
  }

}
