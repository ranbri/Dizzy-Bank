import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WireService {

  constructor(
    private http: HttpClient,

  ) { }

  public wireMoney(wireBulk: any): Observable<any> {
    return this.http
      .post<any>('http://localhost:3000/api/wire/bulk', wireBulk, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('content-type', 'application/json')
      })
  }


}
