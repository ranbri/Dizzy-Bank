import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Card } from 'src/app/models/card';
import { Check } from 'src/app/models/check';
import { Loan } from 'src/app/models/loan';
import { Message } from 'src/app/models/message';
import { User } from 'src/app/models/user';
import { GetSelectedCard, GetSelectedCheck, GetSelectedLoan, GetSelectedUser } from 'src/app/redux/user-store/actions';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-back-message',
  templateUrl: './back-message.component.html',
  styleUrls: ['./back-message.component.scss']
})
export class BackMessageComponent implements OnInit, OnDestroy {
  public selectedCard: Card = new Card;
  public selectedLoan: Loan = new Loan;
  public selectedCheck: Check = new Check;
  public selectedDecision: string = "";
  public admin: User = new User;
  public selectedUser: User = new User;
  public message: Message = new Message;
  public newMessage!: FormGroup;
  public messageBol: boolean = true;
  constructor(
    private store: Store,
    private messagesService: MessagesService,
    private router: Router

  ) { }

  ngOnInit(): void {
    this.newMessage = new FormGroup({
      title: new FormControl(),
      body: new FormControl(),
      select: new FormControl()
    })
    this.store.select(state => state.user)
      .subscribe(user => {
        if (user.user.email) {
          this.admin = user.user;
        }
        if (user.selectedUser.email) {
          this.selectedUser = user.selectedUser;
        }
        if (user.selectedCard.userID) {
          this.selectedCard = user.selectedCard;
        }
        if (user.selectedLoan.userID) {
          this.selectedLoan = user.selectedLoan;
        }
        if (user.selectedCheck.userID) {
          this.selectedCheck = user.selectedCheck;
        }
        if (user.decision) {
          this.selectedDecision = user.decision;
        }
      })
  }

  public sendMessage() {
    let loading: any = document.getElementById('loading');
    loading.style.display = "block";
    let sumCard: any = this.selectedCard.userID ? document.getElementById('sumCard')?.innerHTML : "";
    let sumCheck: any = this.selectedCheck.userID ? document.getElementById('sumCheck')?.innerHTML : "";
    let sumLoan: any = this.selectedLoan.userID ? document.getElementById('sumLoan')?.innerHTML : "";
    let sum = sumLoan + sumCard + sumCheck;

    console.log(sum);
    this.message = {
      userID: this.selectedUser._id,
      adminID: this.admin._id,
      title: this.newMessage.controls['title'].value,
      body: sum + "||" + this.newMessage.controls['body'].value,
      status: "pending",
      date: new Date().toLocaleDateString(),
      hour: new Date().getHours().toString() + ":" + new Date().getMinutes().toString(),
      sender: "Admin",
      from: this.admin.firstName + " " + this.admin.lastName,
      to: this.selectedUser.firstName + " " + this.selectedUser.lastName
    }
    this.messagesService.sendMessage(this.message).subscribe(() => {
      
      alert(`Message sent to ${this.selectedUser.firstName + " " + this.selectedUser.lastName}`)
      let title: any = document.getElementById('title');
      let body: any = document.getElementById('body');
      title.value = "";
      body.value = "";
      this.router.navigate(['/admin/users'])
    });
  }



  public validateMessage() {
    let title: any = document.getElementById('title');
    let body: any = document.getElementById('body');
    if (body.value && title.value) {
      if (body.value.length > 10 && title.value.length > 3) {
        this.messageBol = false;
      } else {
        this.messageBol = true;
      }
      if (body.value.length < 10) {
        body.style.border = "1px solid red";
      } else {
        body.style.border = "1px solid lightgray";
      }
      if (title.value.length < 3) {
        title.style.border = "1px solid red";
      } else {
        title.style.border = "1px solid lightgray";
      }
    } else {
      this.messageBol = true;
    }
  }
  ngOnDestroy() {
    this.store.dispatch(new GetSelectedLoan(new Loan));
    this.store.dispatch(new GetSelectedCheck(new Check));
    this.store.dispatch(new GetSelectedCard(new Card));
    this.store.dispatch(new GetSelectedUser(new User));
  }
}
