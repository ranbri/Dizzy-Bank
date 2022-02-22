import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Loan } from 'src/app/models/loan';
import { LoanService } from 'src/app/services/loan.service';
import { MoneyMoveComponent } from '../../money-move/money-move.component';

@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.scss']
})
export class LoansComponent implements OnInit {
  @Input() generatedLoan: Loan | any;
  loan: Loan = new Loan;
  gridsize: any = 0;
  remaining: number = 0;
  newRemaining!:number;
  updateSetting() {
    let range: any = document.getElementById(`range-${this.generatedLoan._id}`);
    let labelValue: any = document.getElementById(`labelValue-${this.generatedLoan._id}`);
    this.gridsize = range.value;
  }
  constructor(
    private store: Store,
    private moneyMoveComponent: MoneyMoveComponent,
    private router: Router,
    private loanService: LoanService,



  ) { }

  ngOnInit(): void {
    this.remaining = this.generatedLoan.remainingAmount;
    if (this.generatedLoan.remainingAmount === 0) {
      this.loanService.deleteLoanByID(this.generatedLoan).subscribe();
    }
    if (this.generatedLoan.remainingAmount < 0) {
      this.loanService.payLoanByID(this.generatedLoan.remainingAmount, this.generatedLoan).subscribe();
      this.loanService.deleteLoanByID(this.generatedLoan).subscribe();
    }
  }

  public payLoan() {
    let range: any = document.getElementById(`range-${this.generatedLoan._id}`);
    this.remaining = this.remaining - this.gridsize;
    let remainingAmount: any = document.getElementById(`remaining-${this.generatedLoan._id}`);
    this.newRemaining = +remainingAmount.innerHTML - this.gridsize;
    remainingAmount.innerHTML = this.newRemaining;
    this.loan = this.generatedLoan;
    this.router.navigate(['/myAccount/moneyMove'])
    if (this.gridsize !== 0) {
      this.loanService.payLoanByID(-this.gridsize, this.generatedLoan).subscribe(() => { }, (err) => {
        console.log(err);
      });
    }
    range.value = 0;
    this.gridsize = 0;
  }
}
