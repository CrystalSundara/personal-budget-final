import { Component, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js';
import { DataService } from '../services/data.service';
import { ErrorService } from '../services/error.service';

@Component({
  selector: 'pb-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
  constructor(public dataService: DataService, public errorService: ErrorService) { }

  ngAfterViewInit(): void {
    this.dataService.getChartData().subscribe((data: any) => {
      this.createChart(data);
      this.createRadarChart(data);
      this.createMixedChart(data);
    });
    // console.log('Home', this.errorService.errMsg);
    // console.log('Home', this.dataService.errMsg);
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

  createRadarChart(data): void {
    const chartLabels = [];
    const values = [];
    for (let i = 0; i < data.length; i++) {
      chartLabels[i] = data[i].title;
      values[i] = data[i].budget;
    }

    const canvas = document.getElementById('radar') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    const myRadarChart = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: chartLabels,
          datasets: [
            {
            label: 'Total budget',
            data: values,
            borderColor: '#790149',
            backgroundColor: 'rgba(255, 0, 0, 0.1)'
          },
      ],
    },
  });
  }

  createMixedChart(data): void {
    const chartLabels = [];
    const values = [];
    for (let i = 0; i < data.length; i++) {
      chartLabels[i] = data[i].title;
      values[i] = data[i].budget;
    }

    const canvas = document.getElementById('mixed') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    const myRadarChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: chartLabels,
          datasets: [
            {
              label: 'Expenses',
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
              type: 'line',
              borderColor: '#333333',
              fill: false
            },
            {
            label: 'Budget',
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
