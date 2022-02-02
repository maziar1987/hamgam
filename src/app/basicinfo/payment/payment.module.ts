import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentRoutingModule } from './payment-routing.module';
import { ListPaymentComponent } from './list-payment/list-payment.component';
import { EditPaymentComponent } from './edit-payment/edit-payment.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AppSharedModule } from 'src/app/app-shared/app-shared.module';


@NgModule({
  declarations: [ListPaymentComponent, EditPaymentComponent],
  imports: [
    CommonModule,
    PaymentRoutingModule,   
    ReactiveFormsModule,
    AppSharedModule,
  ]
})
export class PaymentModule { }
