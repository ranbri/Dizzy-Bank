import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Check } from '../models/check';
import { GetChecks } from '../redux/user-store/actions';

@Injectable({
  providedIn: 'root'
})
export class PaycheckService {

  constructor(
    private http: HttpClient,
    private store: Store,
    private router: Router,
  ) { }
    public moneyMoveComponent:any;

  public addPaycheck(check: Check): Observable<Check> {
    return this.http
      .post<Check>('http://localhost:3000/api/checks/add', check, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('content-type', 'application/json')
      })
  }
  public getPaychecksByID(userID: string | any): Observable<Check> {
    return this.http
      .get<Check>(`http://localhost:3000/api/checks/checks/${userID}`, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('content-type', 'application/json')
      })
  }
  public getPendingPaychecksByID(userID: string | any): Observable<Check> {
    return this.http
      .get<Check>(`http://localhost:3000/api/checks/checks/${userID}`, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('content-type', 'application/json')
      })
  }
  public setChecks(checks:Check[]){
    this.store.dispatch(new GetChecks(checks));
  }


  public getGetMoneyMoveComponenet(arg:any){
    this.moneyMoveComponent =arg;
  }

  public reloadMoneyMove(){
    this.moneyMoveComponent.ngOnInit();
  }
}
