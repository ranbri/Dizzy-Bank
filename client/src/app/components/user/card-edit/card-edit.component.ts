import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { Card } from 'src/app/models/card';
import { Payment } from 'src/app/models/payment';
import { User } from 'src/app/models/user';
import { GetCards } from 'src/app/redux/user-store/actions';
import { CardService } from 'src/app/services/card.service';
import { PaymentsService } from 'src/app/services/payments.service';

@Component({
  selector: 'app-card-edit',
  templateUrl: './card-edit.component.html',
  styleUrls: ['./card-edit.component.scss']
})
export class CardEditComponent implements OnInit {
  myCard: Card | any = new Card;
  user: User | any = new User;
  payments: Payment[] = [];
  cardID: any = "";
  sliderValue: any;
  rangeValue: any;
  stateBol: boolean = true;
  cardBol: boolean = true;
  paymentsBol: boolean = true;
  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private cardService: CardService,
    private paymentsService: PaymentsService,

  ) { }


  ngOnInit(): void {
    let paymentsLoading: any = document.getElementById('paymentsLoading');
    let loading: any = document.getElementById('loading');
    if (loading) {
      loading.style.display = 'block';
      this.store.select(state => state.user)
        .subscribe((e: any) => {
          if (this.stateBol) {
            this.user = e.user;
            if (this.user._id) {
              if (this.cardBol) {
                let cardSub = this.cardService.getCardsByID(this.user._id)
                  .subscribe((cards: any) => {
                    if (cards) {
                      this.cardBol = false;
                    }
                    this.store.dispatch(new GetCards(cards));
                  }, err => {
                    console.log(err);
                  })
              }

            }
            e.cards.map((card: any) => {
              let paramSub = this.route.params
                .subscribe(id => {
                  this.cardID = id['id'];
                  loading.style.display = 'none';
                })
              if (this.cardID == card._id) {
                this.myCard = card;
                if (this.myCard.status == 'active' || this.myCard.status == 'pending') {
                  this.sliderValue = this.myCard.usedCredit;
                  if (this.myCard.cardNumber) {
                    setTimeout(() => {
                      let progress_bar: any = document.getElementById('progress-bar-limit');
                      let precentageCalc: number = (this.myCard.usedCredit / this.myCard.monthlyLimit) * 100;
                      progress_bar.style.width = precentageCalc + '%';
                      this.rangeValue = this.myCard.monthlyLimit - this.myCard.usedCredit + "$";
                      loading.style.display = 'none';
                      this.stateBol = false;
                      paramSub.unsubscribe();
                    }, 2000);
                  }


                  if (this.myCard._id) {
                    this.paymentsService.getPaymentsByCardID(this.myCard._id)
                      .subscribe((payments: Payment[]) => {
                        this.payments = payments;
                        this.paymentsBol = false;
                        paymentsLoading.innerHTML = '';
                      }, (err) => {
                        if (paymentsLoading) {
                          paymentsLoading.innerHTML = `
                            <br><br>
                            <p class="text-danger h3">${err.error.text}</p>
                            `
                        }
                      })
                  }
                } else {
                  if (this.myCard._id) {
                    this.paymentsService.getPaymentsByCardID(this.myCard._id)
                      .subscribe((payments: Payment[]) => {
                        this.payments = payments;
                        this.paymentsBol = false;
                        paymentsLoading.innerHTML = '';
                      }, (err) => {
                        if (paymentsLoading) {
                          paymentsLoading.innerHTML = `
                            <br><br>
                            <p class="text-danger h3">${err.error.text}</p>
                            `
                        }
                        console.log(err.error.text);
                      })
                  }
                }
              }
            })
          }
        })
    }
  }
}
