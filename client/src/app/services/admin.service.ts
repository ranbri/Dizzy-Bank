import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Card } from '../models/card';
import { Check } from '../models/check';
import { Loan } from '../models/loan';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private http: HttpClient,

  ) { }

  public fulfillLoan(userID: string, loanID: string, addedValue: any, dateApproved: string) {
    let increaseValue = { userID, loanID, addedValue, dateApproved }
    return this.http
      .post('http://localhost:3000/api/admin//fulfill/loan', increaseValue, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('content-type', 'application/json')
      })
  }
  public denyLoan(loanID: string) {
    return this.http
      .post(`http://localhost:3000/api/admin//deny/loan/${loanID}`, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('content-type', 'application/json')
      })
  }
  public fulfillCheck(userID: string, checkID: string, addedValue: any, dateApproved: string, by: string) {
    let increaseValue = { userID, checkID, addedValue, dateApproved, by }
    return this.http
      .post('http://localhost:3000/api/admin//fulfill/check', increaseValue, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('content-type', 'application/json')
      })
  }
  public denyCheck(checkID: string) {
    return this.http
      .post(`http://localhost:3000/api/admin//deny/check/${checkID}`, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('content-type', 'application/json')
      })
  }
  public getAllUser(): Observable<User[]> {
    return this.http
      .get<User[]>(`http://localhost:3000/api/admin/users`, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('content-type', 'application/json')
      })
  }
  public changeCardStatus(card: Card, status: string) {
    let change = {
      status,
      card
    }
    return this.http
      .post(`http://localhost:3000/api/admin/status/card`, change, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('content-type', 'application/json')
      })
  }
  public deleteCard(cardID: string) {
    return this.http
      .post(`http://localhost:3000/api/admin/delete/card/${cardID}`, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('content-type', 'application/json')
      })
  }

  public findLoans(arg: any) {
    let loansLoading: any = document.getElementById('loansLoading');
    loansLoading.style.display = 'block';
    let container: any = document.getElementById('loanRequestContainer');
    container.innerHTML = "";
    arg.errorMessage.nativeElement.style.display = "none";
    if (arg.selectedUser._id) {
      arg.loanService.getLoansByID(arg.selectedUser._id)
        .subscribe(((loans: Loan | any) => {
          if (loans.length) {
            arg.selectedUserLoans = loans;
            arg.loanService.setLoans(loans);
            loans.forEach((loan: any) => {
              container ? container.style.display = "block" : console.log("No Container");
              let card = document.createElement('div');
              card.className = 'checkCard requestItem';
              card.innerHTML = `
            <div class="row">
                <div class="col-3">
                    <label>Loan Spread:</label>
                    <p>${loan.years} years</p>
                </div>
                <div class="col-3">
                    <label>Loan Amount:</label>
                    <p>${loan.totalAmount}$</p>
                </div>
                <div class="col-3">
                  <label>Interest Rate:</label>
                  <p >${loan.interestRate}</p>
                </div>
                <div class="col-3">
                    <label>Fullfilled:</label>
                    <p 
                    style=${!loan.fulfilled ?
                  '"color:red;"' : '"color:#00E239;"'}
                    >${!loan.fulfilled ? " No" : "Yes"}</p>
                </div>
                <div class="col-3">
                <label>Status:</label>
                <p 
                style=${loan.status == "approved" ? '"color:#00E239;"' : '"color:red;"'}
                >${loan.status == "approved" ? "Approved" : loan.status}</p>
                 </div>
                <div class="col-3">
                    <label>Monthly Pay:</label>
                    <p>${Math.round(loan.payPerMonth * 0.01 * (100 + +loan.interestRate.replace("%", "")))}$</p>
                </div>
                <div class="col-3">
                  <label>Date Applied:</label>
                  <p>${loan.dateAdded}</p>
                </div>
                <div class="col-3">
                <label>${loan.status == 'approved?' ? "Date Approved:" : loan.status}</label>
                <p>${loan.status == "approved" ? loan.dateApproved : ""}</p>
            </div>
            </div>
            <hr style="display:${loan.status == "approved" || "denied" ? "none" : "block"}">
            <div class="row "> 
              <div class="col-4 text-left"> 
                <button class="btn btn-outline-success" style="display:${loan.status == "pending" ? "block" : "none"}" 
                id="approve-loan-${loan._id}">Approve</button>
              </div>
              <div class="col-4 text-right"> 
                <a class="btn btn-outline-danger " type="button" style="display:${loan.status == "pending" ? "block" : "none"}" 
                id="deny-loan-${loan._id}">Deny</a>
              </div>
            </div>` ;
              container?.append(card);
              loansLoading.style.display = 'none';
              arg.errorMessage.nativeElement.style.display = "none";
              arg.approveLoan(loan);
              arg.denyLoan(loan);
            });

          } else {
            container.innerHTML = "";
            loansLoading.style.display = 'none';
            arg.errorMessage.nativeElement.style.display = "block";
          }
        }));
    }
  }

  public async findChecks(arg: any) {
    let checksLoading: any = document.getElementById('checksLoading');
    checksLoading.style.display = 'block';
    arg.errorMessageChecks.nativeElement.innerHTML = "";
    let container: any = document.getElementById('checkRequestContainer');
    container.innerHTML = "";
    arg.paycheckService.getPaychecksByID(arg.selectedUser._id)
      .subscribe(((checks: Check | any) => {
        if (checks.length) {
          container ? container.style.display = "block" : "";
          arg.paycheckService.setChecks(checks);
          checks.forEach((check: Check) => {
            let card = document.createElement('div');
            card.className = 'checkCard requestItem';
            card.innerHTML = `
                  <div class="row">
                  <div class="col-4">
                    <label>From:</label>
                    <p>${check.name}</p>
                    </div>
                <div class="col-4">
                    <label>Bank Number:</label>
                    <p>${check.bankNumber}</p>
                    </div>
                    <div class="col-4">
                    <label>Status:</label>
                    <p 
                    style=${check.status == "approved" ? '"color:#00E239;"' : '"color:red;"'}
                    >${check.status == "approved" ? "Approved" : check.status}</p>
                </div>
                <div class="col-4">
                    <label>Amount:</label>
                    <p >${check.amount}$</p>
                </div>
                <div class="col-4">
                <label>Date Applied:</label>
                    <p>${check.dateAdded}</p>
                    </div>
                    <div class="col-4">
                    <label>${check.status == 'approved?' ? "Date Approved:" : check.status}</label>
                    <p>${check.status == "approved" ? check.dateApproved : ""}</p>
                    </div>
                    </div>
                    <hr style="display:${check.status == "approved" || "denied" ? "none" : "block"}">
                    <div class="row "> 
                    <div class="col-4 text-left"> 
                    <button class="btn btn-outline-success" style="display:${check.status == "pending" ? "block" : "none"}" 
                    id="approve-check-${check._id}">Approve</button>
                    </div>
                    <div class="col-4 text-right"> 
                    <a class="btn btn-outline-danger " type="button" style="display:${check.status == "pending" ? "block" : "none"}" 
                    id="deny-check-${check._id}">Deny</a>
                    </div>
                    </div>`;
            container?.append(card);
            arg.errorMessageChecks.nativeElement.innerHTML = "";
            checksLoading.style.display = 'none';
            arg.denyCheck(check);
            arg.approveCheck(check);
          });
        } else {
          checksLoading.style.display = 'none';
          arg.errorMessageChecks.nativeElement.innerHTML = "No Checks found."
        }
      }));
  }
}
