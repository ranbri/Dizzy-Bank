import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Card } from 'src/app/models/card';
import { CardService } from 'src/app/services/card.service';

@Component({
  selector: 'app-cancel-card',
  templateUrl: './cancel-card.component.html',
  styleUrls: ['./cancel-card.component.scss']
})
export class CancelCardComponent implements OnInit {
  @Input() myCard: Card | any;
  newCard:Card = new Card;
  checkboxCancel:any;
  constructor(
    private cardService:CardService,
    private router:Router
  ) { }

  public cancelCard(){
    this.cardService.cancelCard(this.myCard._id , "pending")
    .subscribe()
    .unsubscribe();
    this.router.navigate(['/myAccount']);
    alert("Request will be reviewed by an admin for cancellation.")
  }


  ngOnInit(): void {
  }
}
