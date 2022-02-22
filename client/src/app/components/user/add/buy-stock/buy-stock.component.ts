import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Card } from 'src/app/models/card';
import { User } from 'src/app/models/user';
import { GetCards } from 'src/app/redux/user-store/actions';
import { CardService } from 'src/app/services/card.service';
import { StockInfoService } from 'src/app/services/stock-info.service';
import { StocksService } from 'src/app/services/stocks.service';

@Component({
  selector: 'app-buy-stock',
  templateUrl: './buy-stock.component.html',
  styleUrls: ['./buy-stock.component.scss']
})
export class BuyStockComponent implements OnInit {
  user: User = new User;
  cards: Card[] = [];
  cardsSubBol: boolean = true;



  symbolPicker: any;
  symbolLogic!: string;
  symbolPageBol: boolean = true;
  stockDetailBol: boolean = false;
  buyPageBol: boolean = false;

  stockModel: any = {
    symbol: '',
    bid: '',
    ask: '',
    name: '',
    high: '',
    low: '',
    size: 0,
    total: 0,
    userID: '',
    cardID: ''
  }


  public sliderValue: any = 0;
  public formatLabel(value: number) {
    this.sliderValue = document.querySelector('.mat-slider-thumb-label-text')?.innerHTML;

    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    } return value;
  }
  constructor(
    private store: Store,
    private stockInfoService: StockInfoService,
    private stocksService: StocksService,
    private cardService: CardService,
    private router: Router,


  ) { }
  public getStock() {
    let nextBtn: any = document.getElementById('nextBtn');
    let loadingBtn: any = document.getElementById('loadingBtn');
    nextBtn.style.display = 'none';
    loadingBtn.style.display = 'block';
    let errMessage: any = document.getElementById('errMessage');
    this.stockInfoService.getStockInvest(this.symbolPicker)
      .subscribe(stock => {
        this.stockModel.bid = stock.summaryDetail.bid;
        this.stockModel.ask = stock.summaryDetail.ask > 0 ? stock.summaryDetail.ask : stock.summaryDetail.previousClose;
        this.stockModel.high = stock.summaryDetail.dayHigh;
        this.stockModel.low = stock.summaryDetail.dayLow;
        this.stockModel.symbol = stock.price.symbol;
        this.stockModel.name = stock.price.shortName;
        this.symbolLogic = 'available';
        this.symbolPageBol = false;
        this.stockDetailBol = true;
        nextBtn.style.display = 'block';
        loadingBtn.style.display = 'none';
      }, err => {
        if (err.error.text) {
          nextBtn.style.display = 'block';
          loadingBtn.style.display = 'none';
          this.symbolLogic = 'notFound';
          errMessage.innerHTML = ' *' + err.error.text;
        }
      })
  }
  public deGetStock() {
    this.symbolPageBol = true;
    this.stockDetailBol = false;
  }
  public getBuy(size: number) {
    this.stockModel.size = size;
    let roundTotal = Math.round(size * this.stockModel.ask * 100) / 100;
    this.stockModel.total = roundTotal;
    this.buyPageBol = true;
    this.stockDetailBol = false;
    this.stockModel.userID = this.user._id;
  }
  public deGetBuy() {
    this.buyPageBol = false;
    this.stockDetailBol = true;
  }
  public pay(select: any) {
    let loadingPayBtn: any = document.getElementById('loadingPayBtn');
    let payBtn: any = document.getElementById('payBtn');
    payBtn.style.display = 'none';
    loadingPayBtn.style.display = 'block';
    this.stockModel.cardID = select.value;
    this.stocksService.buyStock(this.stockModel)
      .subscribe(logic => {
        if (logic) {
          alert('Stock purchased successfuly');
          this.router.navigate(['/myAccount'])
        }
        else {
          alert(`Error purchasing stock. 
          if account balance and credit limit is sufficient please contact an admin for further assistance`);
          payBtn.style.display = 'block';
          loadingPayBtn.style.display = 'none';
        }
      })
  }

  ngOnInit(): void {
    this.store.select(state => state.user)
      .subscribe((user) => {
        if (user.user._id) {
          if (this.cardsSubBol) {
            this.user = user.user;
            this.cardService.getCardsByID(user.user._id)
              .subscribe((cards: any) => {
                if (cards.length) {
                  this.store.dispatch(new GetCards(cards));
                  this.cards = cards;
                }
                this.cardsSubBol = false;
              })
          }
        }
      })
  }
}
