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

  public JWTUser(idToken: string) {
    return this.http
      .get(`http://localhost:3000/api/auth/jwtLogin`, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders()
          .append('content-type', 'application/json')
          .append("Authorization", "Bearer " + idToken)
      })
  }



  public storageUser(user: User) {
    localStorage.setItem('email', user.email || '')
    localStorage.setItem('password', user.password || '')
    localStorage.setItem('loggedIn', user.loggedIn ? 'true' : '')
    localStorage.setItem('firstName', user.firstName || '')
    localStorage.setItem('lastName', user.lastName || '')
    localStorage.setItem('phone', user.phone || '')
  }

  public async checkAuth() {
    let user: User = {
      email: localStorage.getItem('email') || "",
      password: localStorage.getItem('password') || ""
      //JWT -----
    }
    if (user) {
      this.loginUser(user).subscribe((resUser: User) => {
        if (
          user.email !== resUser.email ||
          user.firstName !== resUser.firstName ||
          user.lastName !== resUser.lastName ||
          user.password !== resUser.password ||
          user.phone !== resUser.phone
        ) {
          this.storageUser(resUser);
        }
        this.reloadNav();
        if (resUser) {
          this.store.dispatch(new Login({
            _id: resUser._id,
            firstName: resUser.firstName,
            lastName: resUser.lastName,
            email: resUser.email,
            password: resUser.password,
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
          localStorage.clear();
          this.router.navigate(['/home']);
          this.reloadNav();
        }

      })
    }
  }



  public logoutUser(user?: User): Observable<User> | any {
    if (user) {
      localStorage.clear();
      this.store.dispatch(new Logout())
      this.reloadNav()
      return this.http
        .post<User>('http://localhost:3000/api/auth/logout', user, {
          observe: 'body',
          withCredentials: true,
          headers: new HttpHeaders().append('content-type', 'application/json')
        })
    } else {
      localStorage.clear();
      this.store.dispatch(new Logout())
      this.reloadNav()
      return
    }

  }


  public registerUser(registered: User): Observable<User> {
    return this.http
      .post<User>('http://localhost:3000/api/auth/register', registered, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('content-type', 'application/json')
      })
  }


  public loginUser(user: User): Observable<User> {
    return this.http
      .post<User>('http://localhost:3000/api/auth/login', user, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('content-type', 'application/json')
      })
  }
  public getUserByAccountNumber(number: any): Observable<User> {
    return this.http
      .get<User>(`http://localhost:3000/api/auth/number/${number}`, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('content-type', 'application/json')
      })
  }
}
