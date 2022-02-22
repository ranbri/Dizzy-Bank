import { Component, OnChanges, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})





export class NavbarComponent implements OnInit {

  loggedIn: any = localStorage.getItem('loggedIn');
  firstName: any = localStorage.getItem('firstName');
  lastName: any = localStorage.getItem('lastName');
  storageUser: User | any = {
    email: localStorage.getItem('email'),
    password: localStorage.getItem('password')
  }

  user:User = new User;

  constructor(
    private store: Store,
    private authService: AuthService
  ) { }

  public logout() {
    // this.authService.logout();
    // this.authService.reloadNav();


    this.authService.logoutUser(this.storageUser).subscribe()
  }
  ngOnInit(): void {
    this.loggedIn = localStorage.getItem('loggedIn');
    this.firstName = localStorage.getItem('firstName');
    this.lastName = localStorage.getItem('lastName');

    this.authService.addNav(this);
    this.loggedIn = localStorage.getItem('loggedIn');
    if (this.loggedIn === "true") {
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
    }
    let authSub = this.store.select(state => state)
      .subscribe(state => {
        if(state.user.user.email){
          this.user = state.user.user;

        }
      })




  }
  


}

