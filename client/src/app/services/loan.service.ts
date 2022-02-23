import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Loan } from '../models/loan';
import { GetLoans } from '../redux/user-store/actions';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private store: Store

  ) { }







  public addLoan(loan: Loan): Observable<Loan> {
    loan.fulfilled = false;
    return this.http
      .post<Loan>('http://localhost:3000/api/loans/add', loan, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('content-type', 'application/json')
      })

  }
  public getLoansByID(userID: string) {
    return this.http
      .get(`http://localhost:3000/api/loans/find/${userID}`, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('content-type', 'application/json')
      })
  }
  public getPendingLoansByID(userID: string) {
    return this.http
      .get(`http://localhost:3000/api/loans/find/pending/${userID}`, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('content-type', 'application/json')
      })
  }
  public payLoanByID(deduction: number, loan:Loan): Observable<Loan> {
    let updater = {
      deduction,
      loan
    }
    return this.http
      .post<Loan>('http://localhost:3000/api/loans/pay', updater, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('content-type', 'application/json')
      })

  }
  public deleteLoanByID(loan: Loan): Observable<Loan> {
    return this.http
      .post<Loan>(`http://localhost:3000/api/loans/delete`, loan, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('content-type', 'application/json')
      })
  }

  public setLoans(loans: Loan[]) {
    this.store.dispatch(new GetLoans(loans));
  }










  //--------------------- Formaters --------------------------

  public formatInterest(amount: any, planTime: any) {
    return amount + planTime == 10000030 ?
      "4.8%" : amount + planTime == 10000010 ?
        "4.6%" : amount + planTime == 1000005 ?
          "4.4%" : amount + planTime == 1000004 ?
            "4.2%" : amount + planTime == 1000003 ?
              "4.0%" : amount + planTime == 1000002 ?
                "3.8%" : amount + planTime == 1000001 ?
                  //--------------------------------------
                  "3.6%" : amount + planTime == 5000030 ?
                    "4.6%" : amount + planTime == 5000010 ?
                      "4.4%" : amount + planTime == 500005 ?
                        "4.2%" : amount + planTime == 500004 ?
                          "4.0%" : amount + planTime == 500003 ?
                            "3.8%" : amount + planTime == 500002 ?
                              "3.6%" : amount + planTime == 500001 ?
                                //--------------------------------------
                                "3.4%" : amount + planTime == 4000030 ?
                                  "4.4%" : amount + planTime == 4000010 ?
                                    "4.2%" : amount + planTime == 400005 ?
                                      "4.0%" : amount + planTime == 400004 ?
                                        "3.8%" : amount + planTime == 400003 ?
                                          "3.6%" : amount + planTime == 400002 ?
                                            "3.4%" : amount + planTime == 400001 ?
                                              //--------------------------------------
                                              "3.2%" : amount + planTime == 3000030 ?
                                                "4.2%" : amount + planTime == 3000010 ?
                                                  "4.0%" : amount + planTime == 300005 ?
                                                    "3.8%" : amount + planTime == 300004 ?
                                                      "3.6%" : amount + planTime == 300003 ?
                                                        "3.4%" : amount + planTime == 300002 ?
                                                          "3.2%" : amount + planTime == 300001 ?
                                                            //--------------------------------------
                                                            "3.0%" : amount + planTime == 2000030 ?
                                                              "4.0%" : amount + planTime == 2000010 ?
                                                                "3.8%" : amount + planTime == 200005 ?
                                                                  "3.6%" : amount + planTime == 200004 ?
                                                                    "3.4%" : amount + planTime == 200003 ?
                                                                      "3.2%" : amount + planTime == 200002 ?
                                                                        "3.0%" : amount + planTime == 200001 ?
                                                                          //--------------------------------------
                                                                          "3.0%" : amount + planTime == 1000030 ?
                                                                            "3.8%" : amount + planTime == 1000010 ?
                                                                              "3.6%" : amount + planTime == 100005 ?
                                                                                "3.4%" : amount + planTime == 100004 ?
                                                                                  "3.2%" : amount + planTime == 100003 ?
                                                                                    "3.0%" : amount + planTime == 100002 ?
                                                                                      "2.8%" : amount + planTime == 100001 ?
                                                                                        //--------------------------------------
                                                                                        "3.0%" : amount + planTime == 500030 ?
                                                                                          "3.6%" : amount + planTime == 500010 ?
                                                                                            "3.4%" : amount + planTime == 50005 ?
                                                                                              "3.2%" : amount + planTime == 50004 ?
                                                                                                "3.0%" : amount + planTime == 50003 ?
                                                                                                  "2.8%" : amount + planTime == 50002 ?
                                                                                                    "2.6%" : amount + planTime == 50001 ?
                                                                                                      //--------------------------------------
                                                                                                      "2.4%" : "";
  }
  public formatCredit(amount: any, planTime: any) {
    return amount + planTime == 10000030 ?
      "740" : amount + planTime == 10000010 ?
        "750" : amount + planTime == 1000005 ?
          "760" : amount + planTime == 1000004 ?
            "770" : amount + planTime == 1000003 ?
              "780" : amount + planTime == 1000002 ?
                "790" : amount + planTime == 1000001 ?
                  "800" : amount + planTime == 5000030 ?
                    "670" : amount + planTime == 5000010 ?
                      "680" : amount + planTime == 500005 ?
                        "690" : amount + planTime == 500004 ?
                          "700" : amount + planTime == 500003 ?
                            "710" : amount + planTime == 500002 ?
                              "720" : amount + planTime == 500001 ?
                                "730" : amount + planTime == 4000030 ?
                                  "680" : amount + planTime == 4000010 ?
                                    "690" : amount + planTime == 400005 ?
                                      "700" : amount + planTime == 400004 ?
                                        "710" : amount + planTime == 400003 ?
                                          "720" : amount + planTime == 400002 ?
                                            "730" : amount + planTime == 400001 ?
                                              "740" : amount + planTime == 3000030 ?
                                                "690" : amount + planTime == 3000010 ?
                                                  "700" : amount + planTime == 300005 ?
                                                    "710" : amount + planTime == 300004 ?
                                                      "720" : amount + planTime == 300003 ?
                                                        "730" : amount + planTime == 300002 ?
                                                          "740" : amount + planTime == 300001 ?
                                                            "750" : amount + planTime == 2000030 ?
                                                              "700" : amount + planTime == 2000010 ?
                                                                "710" : amount + planTime == 200005 ?
                                                                  "720" : amount + planTime == 200004 ?
                                                                    "730" : amount + planTime == 200003 ?
                                                                      "740" : amount + planTime == 200002 ?
                                                                        "750" : amount + planTime == 200001 ?
                                                                          "750" : amount + planTime == 1000030 ?
                                                                            "710" : amount + planTime == 1000010 ?
                                                                              "720" : amount + planTime == 100005 ?
                                                                                "730" : amount + planTime == 100004 ?
                                                                                  "740" : amount + planTime == 100003 ?
                                                                                    "750" : amount + planTime == 100002 ?
                                                                                      "760" : amount + planTime == 100001 ?
                                                                                        "750" : amount + planTime == 500030 ?
                                                                                          "720" : amount + planTime == 500010 ?
                                                                                            "730" : amount + planTime == 50005 ?
                                                                                              "740" : amount + planTime == 50004 ?
                                                                                                "750" : amount + planTime == 50003 ?
                                                                                                  "760" : amount + planTime == 50002 ?
                                                                                                    "770" : amount + planTime == 50001 ?
                                                                                                      "780" : "";
  }
}
