import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MyStock } from '../models/myStock';

@Injectable({
  providedIn: 'root'
})
export class StocksService {

  constructor(
    private http: HttpClient,

  ) { }

  public buyStock(stock: any): Observable<any> {
    return this.http
      .post<any>('http://localhost:3000/stocks/add', stock, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('content-type', 'application/json')
      })
  }
  public sellStock(sellStock: any): Observable<any> {
    return this.http
      .post<any>('http://localhost:3000/stocks/sell', sellStock, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('content-type', 'application/json')
      })
  }
  public getStocksByUserD(userID: string): Observable<MyStock[]> {
    return this.http
      .get<MyStock[]>(`http://localhost:3000/stocks/get/${userID}`, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('content-type', 'application/json')
      })
  }
}
