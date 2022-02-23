import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { WireService } from 'src/app/services/wire.service';

@Component({
  selector: 'app-wire',
  templateUrl: './wire.component.html',
  styleUrls: ['./wire.component.scss']
})
export class WireComponent implements OnInit {
  user: User = new User;
  selectedUser: User = new User;
  accountNumberPageBol: boolean = true;
  wireAmountPageBol: boolean = false;
  finalizeWirePageBol: boolean = false;
  public pickerLength: number = 0;
  public sliderValue: any = 0;
  public maxLimit: number = 0;
  public formatLabel(value: number) {
    this.sliderValue = document.querySelector('.mat-slider-thumb-label-text')?.innerHTML;

    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    } return value;
  }

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private wireService: WireService,
    private store: Store,
    private router:Router,


  ) { }

  ngOnInit(): void {
    this.store.select(state => state.user)
      .subscribe(user => {
        if (user.user._id) {
          this.user = user.user;
          this.maxLimit = user.user.balance > 0 ? Math.round(user.user.balance) : 0;
        }
      })
  }
  public updateLength(number: any) {
    this.pickerLength = number;
  }
  public getAccountNumberPicker(number: any) {
    let errMessage: any = document.getElementById('errMessage');
    errMessage.innerHTML = '';
    let nextBtn: any = document.getElementById('nextBtn');
    let loadingBtn: any = document.getElementById('loadingBtn');
    nextBtn.style.display = 'none';
    loadingBtn.style.display = 'block';
    this.userService.getUserByAccountNumber(number)
      .subscribe((to: User) => {
        if (to) {
          if (to.accountNumber === this.user.accountNumber) {
            errMessage.innerHTML = "Can't transfer to the same account.";
            nextBtn.style.display = 'block';
            loadingBtn.style.display = 'none';
          } else {
            this.selectedUser = to;
            this.accountNumberPageBol = false;
            this.wireAmountPageBol = true;
          }

        } else {
          errMessage.innerHTML = 'No User Found.';
          nextBtn.style.display = 'block';
          loadingBtn.style.display = 'none';
        }
      })

  }
  public deGetAccountNumberPicker() {
    this.accountNumberPageBol = true;
    this.wireAmountPageBol = false;
  }

  public wire(amount:any) {
    let wireBtn: any = document.getElementById('wireBtn');
    let loadingWireBtn: any = document.getElementById('loadingWireBtn');
    wireBtn.style.display = 'none';
    loadingWireBtn.style.display = 'block';
    let wireBulk = {
      from: this.user,
      to: this.selectedUser,
      value:amount
    }
    this.wireService.wireMoney(wireBulk)
      .subscribe(logic => {
        if (logic) {
          wireBtn.style.display = 'block';
          loadingWireBtn.style.display = 'none';
          alert('Successfully transfered funds.')
          this.router.navigate(['/myAccount']);
        } else {
          alert('error transfering money');
          wireBtn.style.display = 'block';
          loadingWireBtn.style.display = 'none';
        }
      })
  }


}
