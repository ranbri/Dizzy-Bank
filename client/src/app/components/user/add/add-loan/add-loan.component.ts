import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Loan } from 'src/app/models/loan';
import { GetLoans } from 'src/app/redux/user-store/actions';
import { LoanService } from 'src/app/services/loan.service';
import { PaycheckService } from 'src/app/services/paycheck.service';
import { MoneyMoveComponent } from '../../money-move/money-move.component';

@Component({
  selector: 'app-add-loan',
  templateUrl: './add-loan.component.html',
  styleUrls: ['./add-loan.component.scss']
})
export class AddLoanComponent implements OnInit {
  public application!: FormGroup;
  public generated = {
    monthly: "",
    interest: "",
    balance: ""
  }
  constructor(
    private store: Store,
    private loanService: LoanService,
    private paycheckService: PaycheckService,
    private moneyMoveComponent: MoneyMoveComponent,
    private router: Router,


  ) { }

  ngOnInit(): void {
    this.application = new FormGroup({
      amount: new FormControl(),
      planTime: new FormControl(),
    });


  }

  public generateRequirements() {
    let amount = this.application.controls['amount'].value;
    let planTime = this.application.controls['planTime'].value;
    // let classes = document.querySelector('/text-muted');
    // classes.removeclas
    if (amount !== null && planTime !== null) {
      let generated = document.querySelectorAll('.generated');
      generated.forEach((item: any) => {
        item.classList.remove('disabled');
      })
      for (let i = 0; i < 101; i++) {
        if (+amount == i * 1000) {
          for (let x = 0; x < 31; x++) {
            if (+planTime == x) {
              this.generated.monthly = (amount / (planTime * 12)).toFixed(2).toLocaleString() + "$";
              this.generated.interest = this.loanService.formatInterest(amount, planTime);
              this.generated.balance = Math.round((amount / (planTime * 10))).toLocaleString() + "$";
            }
          }
        }
      }
    }

  }

  public addLoan() {
    let loading: any = document.getElementById('loading');
    loading.style.display = 'block';
    let years = +this.application.controls['planTime'].value;
    let totalAmount = +this.application.controls['amount'].value;
    let interestRate = this.generated.interest;
    let remainingAmount = totalAmount;
    let payPerMonth = +this.generated.monthly.replace("$", "");
    let minBalance = this.generated.balance.replace("$", "").replace(",", "");
    let userID;
    let status = "pending";
    let dateAdded = new Date().toLocaleDateString();
    this.store.select(state => state.user.user._id).subscribe(_id => userID = _id)
    let loan: Loan = {
      years,
      totalAmount,
      interestRate,
      remainingAmount,
      payPerMonth,
      minBalance: +minBalance,
      userID,
      dateAdded,
      status
    }
    this.loanService.addLoan(loan)
      .subscribe(async () => {
        this.store.dispatch(GetLoans)
        loading.style.display = 'none';
        try {
           this.moneyMoveComponent.findLoans();
        } finally {
          alert("Loan submitted successfully and will be reviewed by an admin.");
          this.moneyMoveComponent.loading.style.display = 'none';
        }
      })
  }
}
