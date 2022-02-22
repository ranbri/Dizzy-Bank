import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(
    private http: HttpClient,

  ) { }



  public sendMessage(message: Message): Observable<Message> {
    return this.http
      .post<Message>('http://localhost:3000/api/messages/send', message, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('content-type', 'application/json')
      })
  }
  public getMessagesByUserId(userID: string): Observable<any> {
    return this.http
      .get(`http://localhost:3000/api/messages/users/${userID}`, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('content-type', 'application/json')
      })
  }
  public getMessagesByAdminId(adminID: string): Observable<any> {
    return this.http
      .get(`http://localhost:3000/api/messages/admins/${adminID}`, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('content-type', 'application/json')
      })
  }
  public getAllAdmins(): Observable<any> {
    return this.http
      .get(`http://localhost:3000/api/admin/admins`, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('content-type', 'application/json')
      })
  }
  public sendRead(userID: string): Observable<string> {
    return this.http
      .post<any>(`http://localhost:3000/api/messages/read/${userID}`, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('content-type', 'application/json')
      })
  }

}

