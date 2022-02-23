import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Stock } from '../models/stock-metric';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';





@Injectable({
  providedIn: 'root'
})
export class StockInfoService {
  baseURL: string = "http://localhost:3000/stocks/";
  stocks: any = {};
  fullStock: any = {};
  errorMessage: any;

  public constructor(
    private httpClient: HttpClient,
    private store: Store
  ) { }


  public  getStockInvest(symbol: string): Observable<any> {

    const fullURL = this.baseURL + symbol;
    return this.httpClient
      .get<any>(fullURL, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('content-type', 'application/json')
      })

  }

  public getStockDaily(symbol: string, year: number, month: string, endDay: string) {
    this.errorMessage = "";
    const fullURL = this.baseURL + symbol + "/" + year + "/" + month + "/" + endDay;
    this.httpClient
      .get(fullURL, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('content-type', 'application/json')
      })
      .subscribe(posts => {
        this.stocks = posts;
      },
        error => this.errorMessage = error.error)
  }

  public async getStockInfo(symbol: string) {
    this.errorMessage = "";
    const fullURL = this.baseURL + symbol;
    this.httpClient
      .get(fullURL, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('content-type', 'application/json')
      })

      .subscribe(
        stock => {
          this.fullStock = stock;
        },
        error => this.errorMessage = error.error)
  }

  public formatDate(date: Date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;
    return [year, month, day].join('-');
  }


 

  public async getStockToday(arg: any) {
    arg.stockDetails = arg.stockService.fullStock;
    arg.dateSelector.symbol = arg.stockDetails.price.symbol;
    arg.dateSelector.first = arg.stockDetails.summaryDetail.bid;
    arg.dateSelector.second = arg.stockDetails.summaryDetail.ask;
    arg.dateSelector.third = arg.stockDetails.price.currency;
    arg.dateSelector.fourth = arg.stockDetails.summaryDetail.previousClose;
    arg.dateSelector.fifth = arg.stockDetails.price.regularMarketOpen;
    arg.dateSelector.sixth = arg.stockDetails.price.shortName;
    arg.dateSelector.date = "Today";
    arg.labelSelector.firstLabel = "Bid:"
    arg.labelSelector.secondLabel = "Ask:"
    arg.labelSelector.thirdLabel = "Currency:"
    arg.labelSelector.forthLabel = "Previous Close:"
    arg.labelSelector.fifthLabel = "Regular Open:"
    arg.labelSelector.sixthLabel = "Name:"
  }

  public formatErrors(arg: any) {
    arg.dateSelector.date = arg.stockService.errorMessage;
    arg.dateSelector.first = arg.stockService.errorMessage;
    arg.dateSelector.second = arg.stockService.errorMessage;
    arg.dateSelector.third = arg.stockService.errorMessage;
    arg.dateSelector.fourth = arg.stockService.errorMessage;
    arg.dateSelector.fifth = arg.stockService.errorMessage;
    arg.dateSelector.sixth = arg.stockService.errorMessage;
    arg.dateSelector.symbol = arg.stockService.errorMessage;

  }

  public formatPage(arg: any) {
    if (arg.dateSelector.first) {
      arg.dateSelector.date = "";
      arg.dateSelector.first = "";
      arg.dateSelector.second = "";
      arg.dateSelector.third = "";
      arg.dateSelector.fourth = "";
      arg.dateSelector.fifth = "";
      arg.dateSelector.sixth = "";
      arg.dateSelector.symbol = "";
    } else {
      this.store.select(state => state.user.loading).subscribe(
        e => {
          if (!e && !arg.dateSelector.first) {
            arg.dateSelector.date = "Data is not available.";
            arg.dateSelector.first = "Data is not available.";
            arg.dateSelector.second = "Data is not available.";
            arg.dateSelector.third = "Data is not available.";
            arg.dateSelector.fourth = "Data is not available.";
            arg.dateSelector.fifth = "Data is not available.";
            arg.dateSelector.sixth = "Data is not available.";
          }
        })
    }
  }
}