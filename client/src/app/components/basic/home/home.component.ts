import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public sliderValue:any = 0;
  public formatLabel(value: number) {
  this.sliderValue = document.querySelector('.mat-slider-thumb-label-text')?.innerHTML;

    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    } return value;
  }


  constructor(private store:Store) { }

  ngOnInit(): void {
    this.startChart();
  }
  public startChart() {
    let pieChart: any = document.getElementById('myChart');
    let myChart = new Chart(pieChart, {
      type: 'pie',
      data: {
        labels: [
          'AMZN',
          'DIS',
          'TSLA',
          'TWTR'
        ],
        datasets: [{
          label: 'My First Dataset',
          data: [30, 50, 10, 8],
          backgroundColor: [
            '#152227',
            '#234d5c',
            '#2c7e98',
            '#62afcb'
          ],
          weight:200,
          hoverOffset: 0,
          hoverBorderWidth: 4
        }]
      },
      options: {
        responsive:true ,

        // responsive: true,
        maintainAspectRatio: true
      },
      
    });
  }


}
