import { Component, Input, OnInit } from '@angular/core';
import { Payment } from 'src/app/models/payment';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
  @Input() payment:Payment | any;
  constructor() { }

  ngOnInit(): void {
  }

}
