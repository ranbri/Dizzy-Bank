import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Card } from 'src/app/models/card';
import { Check } from 'src/app/models/check';
import { Loan } from 'src/app/models/loan';
import { User } from 'src/app/models/user';
import { GetCards, GetDecision, GetSelectedCard, GetSelectedCheck, GetSelectedLoan, GetSelectedUser } from 'src/app/redux/user-store/actions';
import { AdminService } from 'src/app/services/admin.service';
import { CardService } from 'src/app/services/card.service';
import { LoanService } from 'src/app/services/loan.service';
import { PaycheckService } from 'src/app/services/paycheck.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  @ViewChild("errorMessage", { read: ElementRef, static: true })
  errorMessage!: ElementRef;
  @ViewChild("errorMessageChecks", { read: ElementRef, static: true })
  errorMessageChecks!: ElementRef;
  limiter: any;
  cardsContainer: any = document.getElementById('cardsContainer');
  checkRequestContainer: any = document.getElementById('checkRequestContainer');
  loanRequestContainer: any = document.getElementById('loanRequestContainer');
  selectedUser: User = new User;
  selectedUserLoans: Loan[] = [];
  selectedUserChecks: Check[] = [];
  selectedUserCards: Card[] = [];
  public selectedCard: any;
  public selectedLoan: any;
  public selectedCheck: any;
  users: User[] = [];
  constructor(
    private store: Store,
    private adminService: AdminService,
    private cardService: CardService,
    private loanService: LoanService, // used in admin service
    private paycheckService: PaycheckService, // used in admin service
    private router: Router,
  ) { }

  ngOnInit(): void {
    let infoButton: HTMLElement | any = document.getElementById('infoButton');
    infoButton.disabled = 'true';
    let userSelect: HTMLElement | any = document.getElementById('userSelect');
    this.adminService.getAllUser()
      .subscribe(users => {
        if (users.length > 0) {
          infoButton.disabled = '';
          this.users = users;
          users.forEach((user: User) => {
            let fullName = user.firstName + " " + user.lastName;
            let option: HTMLElement | any = document.createElement('option');
            option.value = user._id;
            option.innerHTML = `<option value="">${fullName}</option>`
            userSelect.append(option);
          })
        }
      }, err => { console.log(err) })
  }

  public reactivateCard(card: Card) {
    if (card._id) {
      if (card.status === "pending") {
        this.selectedCard = card;
        this.adminService.changeCardStatus(card|| "", 'active')
          .subscribe((err) => {
            console.log(err);
          });
        this.store.dispatch(new GetDecision("Approve"));
        this.store.dispatch(new GetSelectedCard(this.selectedCard));
        this.router.navigate(['/admin/back-message']);
      }
    }
  }

  public cancelCard(card: Card) {
    if (card._id) {
      if (card.status === "pending") {
        this.selectedCard = card;
        this.adminService.changeCardStatus(card || "", 'cancelled')
          .subscribe((err) => {
            console.log(err);
          });
        this.store.dispatch(new GetDecision("Cancel"));
        this.store.dispatch(new GetSelectedCard(this.selectedCard));
        this.router.navigate(['/admin/back-message']);
      }
    }
  }
  public deleteCard(card: Card) {
    if (card._id) {
      if (card.status === "cancelled") {
        this.selectedCard = card;
        this.adminService.deleteCard(card._id || "")
          .subscribe(() => { }, (err) => {
            console.log(err);
          });
        this.store.dispatch(new GetDecision("Cancel"));
        this.store.dispatch(new GetSelectedCard(this.selectedCard));
        this.router.navigate(['/admin/back-message']);
      }
    }
  }

  public approveCheck(check: Check) {
    if (check._id) {
      if (check.status === "pending") {
        let clickListener: any = document.getElementById(`approve-check-${check._id}`);
        clickListener.addEventListener("click", () => {
          this.selectedCheck = check;
          let today = new Date().toLocaleDateString();
          this.adminService.fulfillCheck(this.selectedUser._id || "", check._id || "", check.amount, today, check.name || "")
            .subscribe((err) => {
              console.log(err);
            });
          this.store.dispatch(new GetDecision("Approve"));
          this.store.dispatch(new GetSelectedCheck(this.selectedCheck));
          this.router.navigate(['/admin/back-message']);
        })
      }
    }
  }

  public denyCheck(check: Check) {
    let checkRequestContainer: any = document.getElementById('checkRequestContainer');
    if (check._id) {
      if (check.status == "pending") {
        let clickListener: any = document.getElementById("deny-check-" + check._id);
        clickListener.addEventListener("click", () => {
          this.selectedCheck = check;
          checkRequestContainer.innerHTML = "";
          for (let i = 0; i < 2; i++) {
            this.adminService.denyCheck(check._id || "")
              .subscribe((err) => { console.log(err) }, err => {
                console.log(err);
              });
          }
          this.store.dispatch(new GetDecision("Deny"));
          this.store.dispatch(new GetSelectedCheck(this.selectedCheck));
          this.router.navigate(['/admin/back-message']);
        })
      }
    }
  }

  public approveLoan(loan: Loan) {
    if (loan._id) {
      if (loan.status == "pending") {
        let clickListener: any = document.getElementById(`approve-loan-${loan._id}`);
        clickListener.addEventListener("click", () => {
          this.selectedLoan = loan;
          let today = new Date().toLocaleDateString();
          this.adminService.fulfillLoan(this.selectedUser._id || "", loan._id || "", loan.totalAmount, today)
            .subscribe((err) => { console.log(err) });
          this.store.dispatch(new GetDecision("Aprrove"));
          this.store.dispatch(new GetSelectedLoan(this.selectedLoan));
          this.router.navigate(['/admin/back-message']);
        })
      }
    }
  }

  public denyLoan(loan: Loan) {
    if (loan._id) {
      if (loan.status == "pending") {
        let clickListener: any = document.getElementById("deny-loan-" + loan._id);
        clickListener.addEventListener("click", () => {
          this.selectedLoan = loan;
          this.adminService.denyLoan(loan._id || "")
            .subscribe((err) => { console.log(err) }, err => {
              console.log(err);
            });
          this.store.dispatch(new GetDecision("Deny"));
          this.store.dispatch(new GetSelectedLoan(this.selectedLoan));
          this.router.navigate(['/admin/back-message']);
        })
      }
    }
  }

  public getInfo() {
    let selectValue: any = document.getElementById('userSelect');
    let user: any;
    for (user of this.users) {
      if (user._id === selectValue.value) {
        this.selectedUser = user;
        this.store.dispatch(new GetSelectedUser(this.selectedUser));
        this.adminService.findLoans(this);
        this.adminService.findChecks(this);
        this.getCards(user);
      }
    }
  }

  public getCards(u: User) {
    let cardsContainer: any = document.getElementById('cardsContainer');
    cardsContainer.style.display = "block";
    let limiter: any = document.querySelector("#limiter");
    let limiterStyle: any = document.querySelector("#limiter");
    let cardsLoading: any = document.getElementById('cardsLoading');
    if (u._id === this.selectedUser._id) {
      cardsLoading.style.display = 'block';
      limiter.innerHTML = '';
      let cardSub = this.cardService.getCardsByID(u._id)
        .subscribe((cards: any) => {
          if (cards.length) {
            this.selectedUserCards = cards;
            cardSub.unsubscribe();
            cardsLoading.style.display = 'none';
            this.store.dispatch(new GetCards(cards))
          }
        }, err => {
          if (err.error.text == "No Cards Found") {
            cardsContainer.style.display = "none";
            cardsLoading.style.display = 'none';
            limiterStyle.style.display = "block";
            limiter.innerHTML = `<p class="text-muted text-center">No Cards Found</p>`;
            cardsLoading.style.display = "none";
          }
        })
    }
  }


}
