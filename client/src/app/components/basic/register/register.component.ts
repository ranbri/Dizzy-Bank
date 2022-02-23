import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthService } from '../../../services/auth.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngxs/store';
import { Login } from 'src/app/redux/user-store/actions';
import { Router } from '@angular/router';
import { MatDatepicker } from '@angular/material/datepicker';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  loading: any = document.getElementById('loading');
  @ViewChild("email", { read: ElementRef, static: true })
  email!: ElementRef;
  @ViewChild("error", { read: ElementRef, static: true })
  error!: ElementRef;
  @ViewChild("formBtn", { read: ElementRef, static: true })
  formBtn!: ElementRef;
  @ViewChild("picker", { read: ElementRef, static: true })
  picker!: ElementRef;
  @ViewChild(MatDatepicker) datePicker: MatDatepicker<Date> | any;
  user!: User;
  currentDate: Date = new Date();
  dob: any;
  validations = {
    phoneValidation: true,

  }
  phoneValue!: any;
  public updateLength(number: any) {
    this.phoneValue = number;
  }
  public registration!: FormGroup;

  constructor(
    private store: Store,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private title: Title,
  ) {
    title.setTitle('Dizzy - Register');
  }


  public onDate(event: any): void {
    this.dob = event;
  }

  public register() {
    let registerBtn: any = document.getElementById('registerBtn');;
    let loadingRegisterBtn: any = document.getElementById('loadingRegisterBtn');;
    registerBtn.style.display = 'none';
    loadingRegisterBtn.style.display = 'block';
    let userValue = this.registration.value
    delete userValue.confirmPassword;
    delete userValue.terms;
    userValue['isAdmin'] = false;
    userValue['loggedIn'] = true;
    userValue['balance'] = 0;
    userValue['dateOfBirth'] = this.registration.controls['dateOfBirth'].value.toLocaleDateString();
    userValue['phone'] = this.phoneValue;
    this.userService.registerUser(userValue)
      .subscribe((user: User): void => {
        if (user) {
          userValue['_id'] = user._id;
          this.user = userValue;
          let addUser: User = userValue;
          this.store.dispatch(new Login({
            _id: addUser._id,
            firstName: addUser.firstName,
            lastName: addUser.lastName,
            email: addUser.email,
            password: addUser.password,
            apartment: addUser.apartment,
            isAdmin: addUser.isAdmin,
            phone: addUser.phone,
            loggedIn: addUser.loggedIn,
            city: addUser.city,
            entrance: addUser.entrance,
            floor: addUser.floor,
            house: addUser.house,
            street: addUser.street,
            zipcode: addUser.zipcode,
          }))
          this.router.navigate(['/login']);
        } else {
          registerBtn.style.display = 'block';
          loadingRegisterBtn.style.display = 'none';
          alert('Error registering client');
        }
      }, err => {
        registerBtn.style.display = 'block';
        loadingRegisterBtn.style.display = 'none';
        let errorMessage = err.error.text;
        console.log(errorMessage);
        this.email.nativeElement.style.border = " 1px solid red";
        this.error.nativeElement.innerHTML = "*" + errorMessage;
        this.error.nativeElement.style.color = "red";
      })


  }


  ngOnInit() {
    if (localStorage.getItem('loggedIn')) this.router.navigate(['/home']);
    this.registration = new FormGroup({
      firstName: new FormControl(),
      lastName: new FormControl(),
      email: new FormControl(),
      password: new FormControl(),
      confirmPassword: new FormControl(),
      city: new FormControl(),
      street: new FormControl(),
      zipcode: new FormControl(),
      house: new FormControl(),
      entrance: new FormControl(),
      floor: new FormControl(),
      apartment: new FormControl(),
      terms: new FormControl(),
      dateOfBirth: new FormControl(),

    });

  }
}