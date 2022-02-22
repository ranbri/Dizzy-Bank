import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Payment } from '../models/payment';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  constructor(
    private http: HttpClient,

  ) { }
  public addPayment(payment: Payment): Observable<Payment> {
    return this.http
      .post<Payment>('http://localhost:3000/api/payments/add', payment, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('content-type', 'application/json')
      })
  }
  public getPayments(userID: string): Observable<Payment[]> {
    return this.http
      .get<Payment[]>(`http://localhost:3000/api/payments/${userID}`, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('content-type', 'application/json')
      })
  }
  public getPaymentsByCardID(cardID: string): Observable<Payment[]> {
    return this.http
      .get<Payment[]>(`http://localhost:3000/api/payments/card/${cardID}`, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('content-type', 'application/json')
      })
  }

}
