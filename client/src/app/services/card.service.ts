import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Card } from '../models/card';
import { GetCards } from '../redux/user-store/actions';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(
    private http: HttpClient,
    private store: Store,
  ) { }
  public accountComponent: any;

  public addCard(card: Card): Observable<Card> {
    return this.http
      .post<Card>('http://localhost:3000/api/cards/add', card, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('content-type', 'application/json')
      })
  }
  public getCardsByID(userID: string | any): Observable<Card> {
    return this.http
      .get<Card>(`http://localhost:3000/api/cards/cards/${userID}`, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('content-type', 'application/json')
      })
  }
  public validateCardNumber(cardNumber: string | any): Observable<any> {
    return this.http
      .get(`http://localhost:3000/api/cards/number/${cardNumber}`, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('content-type', 'application/json')
      })
  }
  public cancelCard(_id: string, status: string): Observable<any> {
    let body = {
      _id: _id,
      status: status
    }
    console.log(body);
    return this.http
      .post<any>('http://localhost:3000/api/cards/cancel', body, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('content-type', 'application/json')
      })
  }
  public setChecks(cards: Card[]) {
    this.store.dispatch(new GetCards(cards));
  }


  public getAccountComponent(arg: any) {
    this.accountComponent = arg;
  }

  public reloadAccount() {
    this.accountComponent.ngOnInit();
  }

  public generateNumbers() {
    let random1 = Math.floor(Math.random() * 10).toString();
    let random2 = Math.floor(Math.random() * 10).toString();
    let random3 = Math.floor(Math.random() * 10).toString();
    let random4 = Math.floor(Math.random() * 10).toString();
    let random5 = Math.floor(Math.random() * 10).toString();
    let random6 = Math.floor(Math.random() * 10).toString();
    let random7 = Math.floor(Math.random() * 10).toString();
    let random8 = Math.floor(Math.random() * 10).toString();
    let bulk = random1 + random2 + random3 + random4 + "-" + random5 + random6 + random7 + random8;
    return bulk;

  }
}
