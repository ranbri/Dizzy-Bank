import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private store: Store,
    private router: Router,
  ) { }

  public loading: boolean = true;

  ngOnInit(): void {
    this.authService.checkAuth();
    let authSub = this.store.select(state => state.user.user.email).subscribe(e => {
      if (e) {
        authSub.unsubscribe();
        setTimeout(() => {
          this.authService.logoutUser();
          this.authService.reloadHeader();
          alert("You have been logged out");
          this.ngOnInit();
          this.router.navigate(['/home']);
        }, 1800000); // Automatic log out after 30 min.
      }
    })

  }


}
