import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditPaymentComponent } from './edit-payment/edit-payment.component';
import { ListPaymentComponent } from './list-payment/list-payment.component';



const routes: Routes = [
  { path: '', component: ListPaymentComponent },
  { path: 'create', component: EditPaymentComponent },
  { path: 'edit/:id', component: EditPaymentComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
