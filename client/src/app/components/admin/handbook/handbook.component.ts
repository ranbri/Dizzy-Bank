import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-handbook',
  templateUrl: './handbook.component.html',
  styleUrls: ['./handbook.component.scss']
})
export class HandbookComponent implements OnInit {
  // item1:any;
  // item2:any;
  // item3:any;
  // item4:any;
  constructor() { }

  ngOnInit(): void {
  }
  public inView(item: any) {
    item.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
  }
}
