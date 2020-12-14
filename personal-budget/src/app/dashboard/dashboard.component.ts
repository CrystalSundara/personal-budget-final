import { Component, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js';
import { DataService } from '../services/data.service';
import { ErrorService } from '../services/error.service';
import { Budget } from '../services/budget';


@Component({
  selector: 'pb-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements AfterViewInit {
  errorMessage = '';
  allBudget: Budget[] = [];
  titles = [];
  budget = [];
  expenses = [];
  colors = [];

  constructor(public dataService: DataService, public errorService: ErrorService) { }

  ngAfterViewInit(): void {
    this.dataService.getAllBudgetData().subscribe({
      next: budget => {
        this.allBudget = budget;
        this.populateChartData();
        this.createPieChart();
        this.createRadarChart();
        this.createMixedChart();
      },
      error: err => this.errorMessage = err
    });
  }

  populateChartData(): void {
    for (let i = 0; i < this.allBudget.length; i++) {
      this.titles[i] = this.allBudget[i].title;
      this.budget[i] = this.allBudget[i].budget;
      this.expenses[i] = this.allBudget[i].expenses;
      this.colors[i] = this.allBudget[i].color;
    }
  }

  createPieChart(): void {
    const canvas = document.getElementById('myChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    const myPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: this.titles,
          datasets: [
            {
            data: this.budget,
            backgroundColor: this.colors,
          },
      ],
    },
  });
  }

  createRadarChart(): void {
    const canvas = document.getElementById('radar') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    const myRadarChart = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: this.titles,
          datasets: [
            {
            label: 'Budget',
            data: this.budget,
            borderColor: '#790149',
            backgroundColor: 'rgba(255, 0, 0, 0.1)'
          },
          {
            label: 'Expenses',
            data: this.expenses,
            borderColor: '#005Fcc',
            backgroundColor: 'rgba(0, 255, 0, 0.1)'
          },
      ],
    },
  });
  }

  createMixedChart(): void {
    const canvas = document.getElementById('mixed') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    const myRadarChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.titles,
          datasets: [
            {
            label: 'Budget',
            data: this.budget,
            backgroundColor: this.colors,
          },
          {
            label: 'Expenses',
            data: this.expenses,
            borderWidth: 1,
            borderColor: this.colors,
            type: 'bar',
            fill: false,
            pointRadius: 10
          },
        ],
      },
    });
  }

  addExpense(expense) {
    console.log('Add expense clicked', expense);
  }

}
