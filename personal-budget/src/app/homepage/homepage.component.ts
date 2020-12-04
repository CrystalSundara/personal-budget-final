import { Component, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js';
import { DataService } from '../data.service';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements AfterViewInit {

  constructor(public dataService: DataService) { }

  ngAfterViewInit(): void {
    this.dataService.getChartData().subscribe((data: any) => {
      this.createChart(data);
    });
  }

  createChart(data): void {
    const chartLabels = [];
    const values = [];
    for (let i = 0; i < data.length; i++) {
      chartLabels[i] = data[i].title;
      values[i] = data[i].budget;
    }

    const canvas = document.getElementById('myChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    const myPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: chartLabels,
          datasets: [
            {
            data: values,
            backgroundColor: [
              '#790149',
              '#005Fcc',
              '#00EBC1',
              '#A700FC',
              '#FF6E3A',
              '#FFDC3D',
              '#00B408',
              '#003D30'
            ],
          },
      ],
    },
  });

  }

}
