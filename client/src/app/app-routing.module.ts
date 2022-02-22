import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { AboutComponent } from "./components/basic/about/about.component";
import { ControlComponent } from "./components/admin/control/control.component";
import { CardEditComponent } from "./components/user/card-edit/card-edit.component";
import { UserContactComponent } from "./components/user/user-contact/user-contact.component";
import { HomeComponent } from "./components/basic/home/home.component";
import { InvestComponent } from "./components/user/invest/invest.component";
import { LandingComponent } from "./components/user/landing/landing.component";
import { LoginComponent } from "./components/basic/login/login.component";
import { MoneyMoveComponent } from "./components/user/money-move/money-move.component";
import { Page404Component } from "./components/basic/page404/page404.component";
import { RegisterComponent } from "./components/basic/register/register.component";
import {  StocksInfoComponent } from "./components/basic/stocks/stocks.-info.component";
import { UserInfoComponent } from "./components/admin/user-info/user-info.component";
import { AdminContactComponent } from "./components/admin/admin-contact/admin-contact.component";
import { BackMessageComponent } from "./components/admin/back-message/back-message.component";
import { HandbookComponent } from "./components/admin/handbook/handbook.component";
import { BuyStockComponent } from "./components/user/add/buy-stock/buy-stock.component";
import { WireComponent } from "./components/user/wire/wire.component";



const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'stocks', component: StocksInfoComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'about', component: AboutComponent },
    // -------------------- User --------------------
    { path: 'myAccount', component: LandingComponent },
    { path: 'myAccount/moneyMove', component: MoneyMoveComponent },
    { path: 'myAccount/investing', component: InvestComponent },
    { path: 'myAccount/investing/buyStock', component: BuyStockComponent },
    { path: 'myAccount/cards/:id', component: CardEditComponent },
    { path: 'myAccount/contact', component: UserContactComponent },
    { path: 'myAccount/wire', component: WireComponent },
    // -------------------- Admin --------------------
    { path: 'admin/control', component: ControlComponent },
    { path: 'admin/users', component: UserInfoComponent },
    { path: 'admin/contact', component: AdminContactComponent },
    { path: 'admin/handbook', component: HandbookComponent },
    { path: 'admin/back-message', component: BackMessageComponent },



    { path: '**', pathMatch: "full", component: Page404Component },
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule, FormsModule]
})
export class AppRoutingModule { }