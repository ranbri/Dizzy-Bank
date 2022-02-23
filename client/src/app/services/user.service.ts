import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http:HttpClient,

  ) { }

  public registerUser(registered: User): Observable<User> {
    return this.http
      .post<User>('http://localhost:3000/api/user/register', registered, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('content-type', 'application/json')
      })
  }

  public getUserByAccountNumber(number: any): Observable<User> {
    return this.http
      .get<User>(`http://localhost:3000/api/user/number/${number}`, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('content-type', 'application/json')
      })
  }

}
