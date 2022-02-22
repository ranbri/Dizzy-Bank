import { Component, Input, OnInit } from '@angular/core';
import { Check } from 'src/app/models/check';


@Component({
  selector: 'app-checks',
  templateUrl: './checks.component.html',
  styleUrls: ['./checks.component.scss']
})
export class ChecksComponent implements OnInit {
  @Input() generatedCheck : Check | any;
  constructor() { }

  ngOnInit(): void {
  }

}
