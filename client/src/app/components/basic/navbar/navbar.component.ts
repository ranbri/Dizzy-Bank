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


  loggedIn: boolean = false;
  user: User = new User;

  constructor(
    private store: Store,
    private authService: AuthService
  ) { }

  public logout() {
    this.authService.logoutUser()
  }
  ngOnInit(): void {
    this.authService.addNav(this);
    this.store.select(state => state.user)
      .subscribe((user: any) => {
     
        if (user.user._id) {
          this.user = user.user;
        } else {
          this.user = new User;
        }
      })
  }
}

