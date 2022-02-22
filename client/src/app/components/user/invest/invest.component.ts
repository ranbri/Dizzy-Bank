import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { MyStock } from 'src/app/models/myStock';
import { User } from 'src/app/models/user';
import { StockInfoService } from 'src/app/services/stock-info.service';
import { StocksService } from 'src/app/services/stocks.service';


@Component({
  selector: 'app-invest',
  templateUrl: './invest.component.html',
  styleUrls: ['./invest.component.scss']
})
export class InvestComponent implements OnInit, OnDestroy {
  user: User = new User;
  stocks: MyStock[] = [];
  stocksSubBol = true;
  currentStock: MyStock = new MyStock;
  public sliderValue: any = 0;
  public formatLabel(value: number) {
    this.sliderValue = document.querySelector('.mat-slider-thumb-label-text')?.innerHTML;

    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    } return value;
  }

  constructor(
    private store: Store,
    private stockService: StocksService,
    private stockInfoService: StockInfoService,

  ) { }
  public getStocks(userID: string) {
    this.stockService.getStocksByUserD(userID)
      .subscribe(stocks => {
        if (stocks) {
          if (stocks.length) {
            this.stocks = stocks;
          }
        } else {
          let errRow: any = document.getElementById('errRow');
          if (errRow) {
            errRow.innerHTML =
              `<p class="text-center h4 text-secondary" >No Stocks Found.</p>
            `;
          }
        }
      })
  }
  public getPrice(symbol: string, row: any) {
    row.style.display = 'block';
    let stockBul = this.stockInfoService.getStockInvest(symbol)
      .subscribe(stockInfo => {
        if (stockInfo) {
          this.stocksSubBol = false;
          stockBul.unsubscribe();
          this.currentStock.ask = stockInfo.summaryDetail.ask > 0 ? stockInfo.summaryDetail.ask : stockInfo.summaryDetail.previousClose;;
        }
      })
  }
  public sellStock(sellPrice: number, sellSize: number, stock: MyStock, stockCard: any) {
    let sellBtn: any = document.getElementById('sellBtn-' + stock._id);
    let loadingSellBtn: any = document.getElementById('loadingSellBtn-' + stock._id);
    sellBtn.style.display = 'none';
    loadingSellBtn.style.display = 'block';
    let sellStock = {
      sellSize,
      sellPrice,
      stock,
    }

    this.stockService.sellStock(sellStock)
      .subscribe(result => {
        if (result) {
          if (sellSize === stock.size) {
            stockCard.innerHTML = '<h1 class="text-center text-danger">Sold</h1>'
            setTimeout(() => {
              stockCard.style.display = 'none'
            }, 1000);
          } else {
            alert('An error has occured selling stocks, please try again later.')
            this.ngOnInit();
          }
        }

      })
  }
  ngOnInit() {
    this.store.select(state => state.user)
      .subscribe(user => {
        if (user.user._id) {
          this.getStocks(user.user._id);
          this.user = user.user;
        }
      })

  }
  ngOnDestroy() {
  }
}
