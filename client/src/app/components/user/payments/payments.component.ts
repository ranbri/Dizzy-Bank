import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Payment } from 'src/app/models/payment';
import { User } from 'src/app/models/user';
import { GetPayments } from 'src/app/redux/user-store/actions';
import { PaymentsService } from 'src/app/services/payments.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {
  @Input() user: User | any;
  @Input() payments: Payment[] = [];
  constructor(
    private paymentsService: PaymentsService,
    private store: Store,


  ) { }



  public loadPayments() {
    const loading: any = document.getElementById('loading');
    loading.style.display = 'block'
    const errMessage: any = document.getElementById('errMessage');
    this.paymentsService.getPayments(this.user._id)
      .subscribe((payments: Payment[]) => {
        if (payments.length) {
          this.store.dispatch(new GetPayments(payments));
          this.payments = payments;
          loading.style.display = 'none'
        }
      }, (err) => {
        if (errMessage) {
          errMessage.innerHTML = err.error.text
        }
        loading.style.display = 'none'
      })
  }
  ngOnInit(): void {
    this.loadPayments();
  }
}
