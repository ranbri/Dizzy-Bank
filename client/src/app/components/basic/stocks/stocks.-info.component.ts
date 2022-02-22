import { Component, ElementRef, OnInit } from '@angular/core';
import { StockInfoService } from 'src/app/services/stock-info.service';
import { FullStock, Stock } from 'src/app/models/stock-metric';
import { Store } from '@ngxs/store';


@Component({
  selector: 'app-stocks-info',
  templateUrl: './stocks-info.component.html',
  styleUrls: ['./stocks-info.component.scss']
})
export class StocksInfoComponent implements OnInit {

  constructor(
    private stockInfoService: StockInfoService,
    private store: Store
  ) { }
  btnStyle: ElementRef<HTMLButtonElement> | any = document.querySelector(".btn");
  btnLogic: boolean = false;
  datePicker: any;
  symbolPicker: any;
  today: Date = new Date();
  public labelSelector: any = {
    firstLabel: "",
    secondLabel: "",
    thirdLabel: "",
    fourthLabel: "",
    fifthLabel: "",
    sixthLabel: "",
  }

  public dateSelector: any = {
    date: "",
    symbol: "",
    first: "",
    second: "",
    third: "",
    fourth: "",
    fifth: "",
    sixth: "",
  };

  public stocks: any
  public stockDetails: FullStock | any;

  public dateClicker() {
    let loading: any = document.getElementById('loading');
    if (loading) {


      loading.style.display = 'block';
      this.stockInfoService.formatPage(this);


      let year = this.datePicker.slice(0, 4);
      let month = this.datePicker.slice(5, 7);
      let day = this.datePicker.slice(8, 10);
      let ogDay = day;
      let ogMonth = month;
      let thisDay = this.today.getDate()
      let tomonth = this.today.getMonth() + 1;
      let toyear = this.today.getFullYear()
      let strYear: string = toyear.toString();
      let strMonth: string = tomonth.toString();
      let strDay: string = thisDay.toString();


      day = +day + 1;
      if (+month === 2) {
        if (+day === 28) {
          day = "01";
          month = "03";
          month.toString();
        }
        if (+day === 28) {
          day = "01";
          if (+month === 10) {
            month = +month + 1;
          }
          month.toString();
        }
      }
      if (+month === 1 || +month === 3 || +month === 5 || +month === 7 || +month === 8 || +month === 10) {
        if (day === 31 || day === 32) {
          day = "01";
          month = +month + 1;
          month.toString();
        }
      }
      if (+month === 4 || 6 || 9 || 11) {
        if (+day === 30) {
          day = "01";
          month = +month + 1;
          month.toString();
        }
      }
      if (month == 12) {
        if (day === 32) {
          day = "01";
          month = "01";
          year = +year + 1;
        }
      }
      if (+strDay < 10) { strDay = "0" + strDay; }
      if (+strMonth < 10) { strMonth = "0" + strMonth; }

      let fullDatePicker = year + "-" + ogMonth + "-" + ogDay;
      let toThisDate = strYear + "-" + strMonth + "-" + strDay;


      this.stockInfoService.getStockDaily(this.symbolPicker, year, month, day);
      this.stockInfoService.getStockInfo(this.symbolPicker);

      setTimeout(() => {
        if (toThisDate == fullDatePicker) {
          this.stockInfoService.getStockToday(this);
          loading.style.display = 'none';
        } else {

          this.stocks = this.stockInfoService.stocks;
          this.stockDetails = this.stockInfoService.fullStock;
          this.stocks.map((s: Stock) => {
            const formatedDate = this.stockInfoService.formatDate(s.date)
            if (formatedDate === this.datePicker) {
              this.dateSelector.symbol = s.symbol;
              this.dateSelector.first = s.open;
              this.dateSelector.second = s.close;
              this.dateSelector.third = s.high;
              this.dateSelector.fourth = s.low;
              this.dateSelector.sixth = this.stockDetails.price.shortName;
              this.dateSelector.fifth = this.stockDetails.price.currency;
              this.dateSelector.date = formatedDate;
              this.labelSelector.firstLabel = "Open:"
              this.labelSelector.secondLabel = "Close:"
              this.labelSelector.thirdLabel = "High:"
              this.labelSelector.forthLabel = "Low:"
              this.labelSelector.fifthLabel = "Currency:"
              this.labelSelector.sixthLabel = "Name:"
            }
          })

        }
        loading.style.display = 'none';
      
        if (this.stockInfoService.errorMessage) {
        this.stockInfoService.formatErrors(this);
      }
    }, 400);
  }
}
ngOnInit(): void {

}
}
