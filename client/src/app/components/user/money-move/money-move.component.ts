import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';

import { Check } from 'src/app/models/check';
import { Loan } from 'src/app/models/loan';
import { Payment } from 'src/app/models/payment';
import { User } from 'src/app/models/user';
import { GetChecks, GetPayments } from 'src/app/redux/user-store/actions';
import { LoanService } from 'src/app/services/loan.service';
import { PaycheckService } from 'src/app/services/paycheck.service';
import { PaymentsService } from 'src/app/services/payments.service';

@Component({
  selector: 'app-money-move',
  templateUrl: './money-move.component.html',
  styleUrls: ['./money-move.component.scss']
})
export class MoneyMoveComponent implements OnInit, OnDestroy {
  @ViewChild("errorMessage", { read: ElementRef, static: true })
  errorMessage!: ElementRef;
  loading: any = "";
  payments: Payment[] = [];
  user: User = new User;
  constructor(
    private store: Store,
    private paycheckService: PaycheckService,
    private loanService: LoanService,
    private paymentsService: PaymentsService,


  ) { }
  loans: Loan[] = [];
  checks: Check[] = [];
  authBol: boolean = true;

  public loadPayments() {
    this.payments = [];
    const loading: any = document.getElementById('loadingPayments');
    const errMessage: any = document.getElementById('errMessagePayments');
    if (loading) {
      loading.style.display = 'block'
      setTimeout(() => {
        if (this.user._id) {
          this.paymentsService.getPayments(this.user._id)
            .subscribe((payments: Payment[]) => {
              if (payments.length) {
                this.store.dispatch(new GetPayments(payments));
                this.payments = payments;
                loading.style.display = 'none'
              }
            }, (err) => {
              errMessage.innerHTML = err.error.text
              loading.style.display = 'none'
            })
        }
      }, 2000);
    }
  }
  public async findChecks() {
    this.loading.style.display = 'block';
    this.errorMessage.nativeElement.innerHTML = "";
    this.paycheckService.getPaychecksByID(this.user._id)
      .subscribe(((checks: Check | any) => {
        if (checks.length) {
          this.checks = checks;
          this.paycheckService.setChecks(checks);
        } else {
          this.loading.style.display = 'none';
          this.errorMessage.nativeElement.innerHTML = "No information found."
          this.errorMessage.nativeElement.innerHTML = "";
        }

      }));

  }
  public findLoans() {
    this.loading.style.display = 'block';
    this.errorMessage.nativeElement.innerHTML = "";
    this.loanService.getLoansByID(this.user._id || "")
      .subscribe(((loans: Loan | any) => {
        if (loans.length) {
          this.loans = loans;
          this.loanService.setLoans(loans);
        } else {
          this.loading.style.display = 'none';
          this.errorMessage.nativeElement.innerHTML = "<hr>"
        }
      }));
  }
  ngOnInit(): void {
    this.loading = document.getElementById('loading');
    this.loading.style.display = 'block';
    this.paycheckService.getGetMoneyMoveComponenet(this);
    this.store.select(state => state.user)
      .subscribe(user => {
        if (user.user.email) {
          this.user = user.user;
          this.loadContainers();
          return
        }
      })

  }

  public loadContainers() {
    if (this.user.email) {
      if (this.authBol) {
        try {
          this.findChecks();
          this.findLoans();
        } finally {
          setTimeout(() => {
            this.loading.style.display = 'none';
          }, 2000);
        }
        this.authBol = false;
        return
      }
    }
  }


  ngOnDestroy() {
    this.loading.style.display = 'none';
  }
}