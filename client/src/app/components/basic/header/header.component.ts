import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  user:User = new User;
  constructor(
    private store:Store,
    private authService:AuthService,


  ) { }
  ngOnInit(): void {
    this.authService.addHeader(this);
    let authSub = this.store.select(state => state.user)
    .subscribe(user => {
      if(user.user.loggedIn){
        this.user = user.user;
      }
    })
  }
}
