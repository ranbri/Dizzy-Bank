import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Card } from 'src/app/models/card';
import { Message } from 'src/app/models/message';
import { User } from 'src/app/models/user';
import { GetCards, GetMessages } from 'src/app/redux/user-store/actions';
import { AuthService } from 'src/app/services/auth.service';
import { CardService } from 'src/app/services/card.service';
import { MessagesService } from 'src/app/services/messages.service';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  cards: Card[] | any = undefined;
  user: User | any;
  cardLimit: number | any = undefined;
  loading: any = "";
  messages: Message[] = [];
  messageBol: boolean = true;
  pendingMessage: number = 0;


  constructor(
    private store: Store,
    private router: Router,
    private cardService: CardService,
    private authService: AuthService,
    private messagesService: MessagesService,
  ) { }

  ngOnInit(): void {
    this.loading = document.getElementById('landingLoading');
    let limiter: any = document.querySelector("#limiter");
    let limiterStyle: any = document.querySelector("#limiter");
    this.cardService.getAccountComponent(this);
    let authSub = this.store.select(state => state.user.user).subscribe(u => {
      if (u._id) {
        this.getMessages(u._id);
        this.user = u;
        let cardSub = this.cardService.getCardsByID(u._id)
          .subscribe((cards: any) => {
            if (cards) {
              cardSub.unsubscribe();
              this.loading.style.display = 'none';

              this.store.dispatch(new GetCards(cards))
              if (cards.length <= 3) {
                limiterStyle.style.display = "block";
                this.loading.style.display = 'none';
                limiter.innerHTML = `
                  <a class="link-secondary" data-bs-toggle="modal" data-bs-target="#addCardModal">
                  Register a new Card?</a>`;
                if (cards.length == 0) {
                  limiter.innerHTML = `
                      <p>You have no available cards. </p>
                      <a class="link-secondary" data-bs-toggle="modal" data-bs-target="#addCardModal">
                      Register a new Card?</a>
                      `
                }
              } if (cards.length >= 3) {
                limiterStyle.style.display = "none";
              }


              this.cardLimit = cards.length;
              this.cards = cards;
              authSub.unsubscribe();
            } else {
              limiterStyle.style.display = "block";
              limiter.innerHTML = `<br>
              <p>You have no available cards. </p>
              <a class="link-secondary" data-bs-toggle="modal" data-bs-target="#addCardModal" style="cursor:pointer;">
              Register a new Card?</a>
              `
              this.loading.style.display = 'none';
              authSub.unsubscribe();
            }
          })
      } else {
        let storageEmail = localStorage.getItem('email');
        if (u.email === undefined && storageEmail === null) {
          this.router.navigate(['/home']);
        }
      }
    })
  }
  public getMessages(id: string) {
    let notification: any = document.getElementById('notification');
    this.messagesService.getMessagesByUserId(id || "")
      .subscribe((messages: Message[]) => {
        this.messages = messages;
        if (this.messages.length > 0) {
          if (this.messageBol) {
            this.store.dispatch(new GetMessages(messages))
            this.messageBol = false;
            this.messages.forEach((message: Message) => {
              if (message.status == 'pending' && message.sender == 'Admin') {
                this.pendingMessage = this.pendingMessage + 1;
              }
              if (this.pendingMessage > 0) {
                notification.style.display = ' block';
                notification.innerHTML = this.pendingMessage;
              } else {
                notification.style.display = ' none';
              }
            });
          }
        } else {
          if (notification) {
            notification.style.display = "none";

          }
        }
      })
  }

}
