import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Card } from 'src/app/models/card';
import { Check } from 'src/app/models/check';
import { Loan } from 'src/app/models/loan';
import { User } from 'src/app/models/user';
import { CheckAuth, GetCards, GetChecks, GetDecision, GetLoans, 
    GetMessages, 
    GetPayments, 
    GetSelectedCard, GetSelectedCheck, GetSelectedLoan, GetSelectedUser, Login, Logout } from './actions'
import { DizzyStateModel } from './actions';

@State<DizzyStateModel>({
    name: 'user',
    defaults: {
        user: new User,
        checks: [],
        loans: [],
        cards: [],
        messages: [],
        payments:[],
        admin: {
            users: [],
            loans: [],
            checks: [],
            cards: [],
        },
        selectedUser: new User,
        selectedCheck: new Check,
        selectedLoan: new Loan,
        selectedCard: new Card,
        decision: ""
    }
})
@Injectable()

export class UserState {
    @Selector()
    static getUser(state: DizzyStateModel) {
        return state
    }
    @Action(CheckAuth)
    async checkAuth({ getState }: StateContext<DizzyStateModel>) {
        const state = getState();
        return state;
    }
    @Action(Login)
    async login({ getState, setState }: StateContext<DizzyStateModel>, { payload }: Login) {
        const state = getState();
        setState({
            ...state,
            user: payload
        })
    }
    @Action(Logout)
    logout({ getState, setState }: StateContext<DizzyStateModel>) {
        const state = getState()
        setState({
            ...state,
            user: new User
        })
    }
 
    @Action(GetChecks)
    async getChecks({ getState, setState }: StateContext<DizzyStateModel>, { payload }: GetChecks) {
        const state = getState();
        setState({
            ...state,
            checks: payload
        })
    }
    @Action(GetLoans)
    async getLoans({ getState, setState }: StateContext<DizzyStateModel>, { payload }: GetLoans) {
        const state = getState();
        setState({
            ...state,
            loans: payload
        })
    }
    @Action(GetCards)
    async getCards({ getState, setState }: StateContext<DizzyStateModel>, { payload }: GetCards) {
        const state = getState();
        setState({
            ...state,
            cards: payload
        })
    }
    @Action(GetMessages)
    async getMessages({ getState, setState }: StateContext<DizzyStateModel>, { payload }: GetMessages) {
        const state = getState();
        setState({
            ...state,
            messages: payload
        })
    }
    @Action(GetPayments)
    async getPayments({ getState, setState }: StateContext<DizzyStateModel>, { payload }: GetPayments) {
        const state = getState();
        setState({
            ...state,
            payments: payload
        })
    }
    @Action(GetSelectedCheck)
    async getSelectedChecks({ getState, setState }: StateContext<DizzyStateModel>, { payload }: GetSelectedCheck) {
        const state = getState();
        setState({
            ...state,
            selectedCheck: payload
        })
    }
    @Action(GetSelectedLoan)
    async getSelectedLoans({ getState, setState }: StateContext<DizzyStateModel>, { payload }: GetSelectedLoan) {
        const state = getState();
        setState({
            ...state,
            selectedLoan: payload
        })
    }
    @Action(GetSelectedCard)
    async getSelectedCards({ getState, setState }: StateContext<DizzyStateModel>, { payload }: GetSelectedCard) {
        const state = getState();
        setState({
            ...state,
            selectedCard: payload
        })
    }
    @Action(GetSelectedUser)
    async getSelectedUser({ getState, setState }: StateContext<DizzyStateModel>, { payload }: GetSelectedUser) {
        const state = getState();
        setState({
            ...state,
            selectedUser: payload
        })
    }
    @Action(GetDecision)
    async getDecision({ getState, setState }: StateContext<DizzyStateModel>, { payload }: GetDecision) {
        const state = getState();
        setState({
            ...state,
            decision: payload
        })
    }
}





