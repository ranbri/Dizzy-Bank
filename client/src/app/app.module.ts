import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LayoutComponent } from './components/layout/layout.component';
import { HomeComponent } from './components/basic/home/home.component';
import { NavbarComponent } from './components/basic/navbar/navbar.component';
import { HeaderComponent } from './components/basic/header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgChartsModule } from 'ng2-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/basic/login/login.component';
import { AboutComponent } from './components/basic/about/about.component';
import { Page404Component } from './components/basic/page404/page404.component';
import { LoadingComponent } from './components/basic/loading/loading.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RegisterComponent } from './components/basic/register/register.component';
import { NgxsModule } from '@ngxs/store';
import { environment } from 'src/environments/environment';
import { UserState } from './redux/user-store/state';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { LandingComponent } from './components/user/landing/landing.component';
import { AddLoanComponent } from './components/user/add/add-loan/add-loan.component';
import { MoneyMoveComponent } from './components/user/money-move/money-move.component';
import { InvestComponent } from './components/user/invest/invest.component';
import { CardsComponent } from './components/user/generated/cards/cards.component';
import { AddCheckComponent } from './components/user/add/add-check/add-check.component';
import { AddCardComponent } from './components/user/add/add-card/add-card.component';
import { CardEditComponent } from './components/user/card-edit/card-edit.component';
import { CancelCardComponent } from './components/user/cancel-card/cancel-card.component';
import { ControlComponent } from './components/admin/control/control.component';
import { UserContactComponent } from './components/user/user-contact/user-contact.component';
import { UserInfoComponent } from './components/admin/user-info/user-info.component';
import { AdminContactComponent } from './components/admin/admin-contact/admin-contact.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BackMessageComponent } from './components/admin/back-message/back-message.component';
import { LoansComponent } from './components/user/generated/loans/loans.component';
import { ChecksComponent } from './components/user/generated/checks/checks.component';
import { HandbookComponent } from './components/admin/handbook/handbook.component';
import { PaymentsComponent } from './components/user/payments/payments.component';
import { InvoiceComponent } from './components/user/generated/invoice/invoice.component';
import { BuyStockComponent } from './components/user/add/buy-stock/buy-stock.component';
import { CardPaymentsComponent } from './components/user/card-edit/card-payments/card-payments.component';
import { StocksInfoComponent } from './components/basic/stocks/stocks.-info.component';
import { WireComponent } from './components/user/wire/wire.component';


@NgModule({
  declarations: [
    // --------- Base Components
    LayoutComponent,
    HomeComponent,
    NavbarComponent,
    HeaderComponent,
    StocksInfoComponent,
    LoginComponent,
    AboutComponent,
    Page404Component,
    LoadingComponent,
    RegisterComponent,
    // --------- User Components
    LandingComponent,
    AddLoanComponent,
    MoneyMoveComponent,
    InvestComponent,
    CardsComponent,
    AddCheckComponent,
    AddCardComponent,
    CardEditComponent,
    CancelCardComponent,
    WireComponent,
    CardPaymentsComponent,
    // --------- Admin Components
    ChecksComponent,
    ControlComponent,
    UserContactComponent,
    UserInfoComponent,
    AdminContactComponent,
    BackMessageComponent,
    LoansComponent,
    HandbookComponent,
    PaymentsComponent,
    // --------- Common Components
    InvoiceComponent,
    BuyStockComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    NgChartsModule,
    BrowserAnimationsModule,
    MatSliderModule,
    HttpClientModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    FormsModule,
    NgxsModule.forRoot([UserState], {
      developmentMode: !environment.production
    }),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
    MatToolbarModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule

  ],
  providers: [DatePipe],
  bootstrap: [LayoutComponent]
})
export class AppModule { }
