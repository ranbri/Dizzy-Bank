import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { Card } from 'src/app/models/card';
import { Check } from 'src/app/models/check';
import { Loan } from 'src/app/models/loan';
import { Message } from 'src/app/models/message';
import { Payment } from 'src/app/models/payment';
import { User } from 'src/app/models/user';

export class Login {
  static readonly type = '[User] Login';
  constructor(public payload: User) { }
}
export class Logout {
  static readonly type = '[User] Logout';
}
export class CheckAuth {
  static readonly type = '[User] CheckAuth';
  constructor(public payload: User) { }
}

export interface DizzyStateModel {
  user: User,
  checks: Check[],
  loans: Loan[],
  cards: Card[],
  messages: Message[],
  payments:Payment[],
  admin: {
    users: User[],
    loans: Loan[],
    checks: Check[],
    cards: Card[],
  },
  selectedUser: User,
  selectedCheck: Check,
  selectedLoan: Loan,
  selectedCard: Card,
  decision: string,
  loader:boolean
}



export class GetChecks {
  static readonly type = '[Checks] GetChecks';
  constructor(public payload: Check[]) { }
}
export class GetLoans {
  static readonly type = '[Loans] GetLoans';
  constructor(public payload: Loan[]) { }
}
export class GetCards {
  static readonly type = '[Cards] GetCards';
  constructor(public payload: Card[]) { }
}
export class GetMessages {
  static readonly type = '[Messages] GetMessages';
  constructor(public payload: Message[]) { }
}
export class GetPayments {
  static readonly type = '[Payments] GetPayments';
  constructor(public payload: Payment[]) { }
}

export class GetSelectedUser {
  static readonly type = '[Selected] GetSelectedUser';
  constructor(public payload: User) { }
}
export class GetSelectedCheck {
  static readonly type = '[Selected] GetSelectedCheck';
  constructor(public payload: Check) { }
}
export class GetSelectedLoan {
  static readonly type = '[Selected] GetSelectedLoan';
  constructor(public payload: Loan) { }
}
export class GetSelectedCard {
  static readonly type = '[Selected] GetSelectedCard';
  constructor(public payload: Card) { }
}
export class GetDecision {
  static readonly type = '[Selected] GetDecision';
  constructor(public payload: string) { }
}
export class GetLoader {
  static readonly type = '[Loader] GetLoader';
  constructor(public payload: 'true') { }
}




