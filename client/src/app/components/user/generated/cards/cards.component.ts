import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Card } from 'src/app/models/card';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {
  @Input() myCard: Card | any;
  @Input() user: User | any;
  userName: string = "";
  constructor(
    private store: Store
  ) { }
  // myCard :Card = new Card;
  ngOnInit(): void {
    this.userName = this.user.firstName + " " + this.user.lastName;
  }

}
