import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { Login, Logout } from '../redux/user-store/actions';




@Injectable({
  providedIn: 'root',
})
export class AuthService {
  navbarComponent: any;
  headerComponent: any;
  user$!: Observable<User>
  userAuth!: boolean;
  constructor(
    private http: HttpClient,
    private store: Store,
    private router: Router,
  ) {
    this.user$ = this.store.select(state => state)
  }
  public addNav(arg: any) {
    this.navbarComponent = arg;
  }
  public reloadNav() {
    this.navbarComponent.ngOnInit();
  }
  public addHeader(arg: any) {
    this.headerComponent = arg;
  }
  public reloadHeader() {
    this.headerComponent.ngOnInit();
  }







  public async checkAuth() {
    let cookieToken: string = document.cookie.replace('token=', '');
    if (cookieToken) {
      this.authUser(cookieToken)
        .subscribe((resUser: User) => {
          if (resUser._id) {
            this.reloadNav();
            this.store.dispatch(new Login({
              _id: resUser._id,
              firstName: resUser.firstName,
              lastName: resUser.lastName,
              email: resUser.email,
              apartment: resUser.apartment,
              isAdmin: resUser.isAdmin,
              phone: resUser.phone,
              loggedIn: resUser.loggedIn,
              city: resUser.city,
              entrance: resUser.entrance,
              floor: resUser.floor,
              house: resUser.house,
              street: resUser.street,
              zipcode: resUser.zipcode,
              balance: resUser.balance,
              accountNumber: resUser.accountNumber
            }))
          } else {
            this.router.navigate(['/home']);
            this.reloadNav();
          }
        })
    }
  }



  public logoutUser(): Observable<User> | any {
    let cookieToken: string = document.cookie.replace('token=', '');
    if (cookieToken) {
      document.cookie = "token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
      this.store.dispatch(new Logout())
      this.http
        .get<User>('http://localhost:3000/api/auth/logout', {
          observe: 'body',
          withCredentials: true,
          headers: new HttpHeaders().append("Authorization", "Bearer " + cookieToken)
        }).subscribe();
    } else {
      document.cookie = "token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
      this.store.dispatch(new Logout())
    }

  }


  public authUser(idToken: string) {
    return this.http.get('http://localhost:3000/api/auth/login', {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append("Authorization", "Bearer " + idToken)
    })
  }

  public loginUser(user: User) {
    return this.http
      .post('http://localhost:3000/api/auth/authUser', user, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('content-type', 'application/json')
      })

  }

}
