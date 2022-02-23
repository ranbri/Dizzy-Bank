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
  email!: string;
  public loading: boolean = true;

  ngOnInit(): void {
    let loading: any = document.getElementById('loading');
    loading.style.display = 'block';
    this.authService.checkAuth();
    let authSub = this.store.select(state => state.user).subscribe(user => {
      console.log(user.loader)

      if (user.user.email) {
        if (user.loader) {
          loading.style.display = 'none';
        }
        this.email = user.user.email;

        authSub.unsubscribe();
        setTimeout(() => {
          this.authService.logoutUser();
          alert("You have been logged out");
          this.ngOnInit();
          this.router.navigate(['/home']);
        }, 1800000); // Automatic log out after 30 min.
      } else {
        if (user.loader) {
          loading.style.display = 'none';
        }
      }
    })

  }


}
