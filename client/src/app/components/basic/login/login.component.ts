import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { CheckAuth, Login } from 'src/app/redux/user-store/actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  title = 'Login - Dizzy';
  user: User = {
    email: "",
    password: ""
  };

  @ViewChild("errorMessage", { read: ElementRef, static: true })
  errorMessage!: ElementRef;
  user$;
  constructor(
    private store: Store,
    private authService: AuthService,
    private router: Router,

  ) {
    this.user$ = this.store.select(state => state)
  }

  ngOnInit() {
    if (localStorage.getItem('loggedIn')) this.router.navigate(['/home']);

    this.store.dispatch(CheckAuth).subscribe()
  }

  login() {
    let loading: any = document.getElementById('loading');
    loading.style.display = 'block';
    this.errorMessage.nativeElement.innerHTML = "";
    this.authService.loginUser(this.user)
      .subscribe((resUser: User): void => {
        this.user['_id'] = resUser._id;
        let loginUser = this.user;
        this.authService.storageUser(resUser);
        if (resUser.email === loginUser.email) {
          resUser['loggedIn'] = true;
          localStorage.setItem('loggedIn', "true")
          this.authService.reloadNav();
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
          }));
          loading.style.display = 'none';
          if (resUser.isAdmin) {
            this.router.navigate(['/admin/control'])
          } else {
            this.router.navigate(['/myAccount'])
          }
        } else {
          loading.style.display = 'none';
          this.errorMessage.nativeElement.innerHTML =
            '<i class="fas fa-asterisk"></i> Email or password is invalid.';
        }
      })
  }
}