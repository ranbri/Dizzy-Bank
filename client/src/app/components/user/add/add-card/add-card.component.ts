import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Card } from 'src/app/models/card';
import { User } from 'src/app/models/user';
import { GetCards } from 'src/app/redux/user-store/actions';
import { AuthService } from 'src/app/services/auth.service';
import { CardService } from 'src/app/services/card.service';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss']
})
export class AddCardComponent implements OnInit {
  loading: any = document.getElementById('loading');
  public bol: boolean = true;
  public cardFormGroup!: FormGroup;
  constructor(
    private cardService: CardService,
    private authService: AuthService,
    private store: Store,
  ) { }

  public addCard() {
    this.loading.style.display = 'block';
    let addedCard = new Card;
    addedCard['provider'] = this.cardFormGroup.controls['provider'].value;
    addedCard['monthlyLimit'] = this.cardFormGroup.controls['monthlyLimit'].value;
    let user: User | any;
    this.store.select(state => state.user.user).subscribe(resUser => { user = resUser })
    addedCard['userID'] = user._id;
    addedCard['status'] = "active";
    let expYear = new Date().getUTCFullYear().toLocaleString().replace(",", "").slice(2);
    addedCard['expYear'] = +expYear + 8;
    let day = new Date().getDate().toLocaleString();
    let month = new Date().getMonth().toLocaleString();
    let year = new Date().getUTCFullYear().toLocaleString().replace(",", "");
    let dateAdded = year + "/" + month + "/" + day;
    addedCard['expMonth'] = +month;
    let providerNumber: number = 0;
    addedCard['provider'] == "cred-it" ? providerNumber = 5352 :
      addedCard['provider'] == "globen" ? providerNumber = 4423 :
        addedCard['provider'] == "diaval" ? providerNumber = 3883 :
          addedCard['provider'] == "kiwi" ? providerNumber = 8844 :
            addedCard['provider'] == "queen-express" ? providerNumber = 5555 :
              addedCard['provider'] == "stacks" ? providerNumber = 4321 : 0;
    addedCard['dateAdded'] = dateAdded;
    addedCard['usedCredit'] = 0;
    let bulk = this.cardService.generateNumbers();
    addedCard.cardNumber = "6462" + "-" + providerNumber + "-" + bulk;

    this.cardService.validateCardNumber(addedCard.cardNumber)
      .subscribe(e => {
        this.bol = e
        if (this.bol) {
          let intBol = setInterval(() => {
            if (this.bol) {
              let newBulk = this.cardService.generateNumbers();
              addedCard.cardNumber = "6462" + "-" + providerNumber + "-" + newBulk;
              this.cardService.validateCardNumber(addedCard.cardNumber).subscribe(e => {
                this.bol = e;
              })
            } else {
              this.cardService.addCard(addedCard)
                .subscribe(() => {
                  this.store.dispatch(GetCards)
                  this.cardService.reloadAccount();
                  this.loading.style.display = 'none';
                  alert("Card registered successfully.");
                })
              clearInterval(intBol);
            }
          }, 2000)
        } else {
          this.cardService.addCard(addedCard)
            .subscribe(() => {
              this.store.dispatch(GetCards)
              this.cardService.reloadAccount();
              this.loading.style.display = 'none';
              alert("Card registered successfully.");
            })
        }
      })
  }

  ngOnInit(): void {
    this.authService.checkAuth();
    this.cardFormGroup = new FormGroup({
      provider: new FormControl(),
      monthlyLimit: new FormControl(),
    });
  }
}