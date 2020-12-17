/*
import { Component, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart } from 'chart.js';
import { DataService } from '../services/data.service';
import { ErrorService } from '../services/error.service';
import { Budget } from '../services/budget';
import { AuthService } from '../services/auth.service';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap/modal/modal.module';
import {Keepalive} from '@ng-idle/keepalive';
import {EventTargetInterruptSource, Idle} from '@ng-idle/core';
import { TimeoutModalComponent } from '../services/timeout-modal';


@Component({
  selector: 'pb-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements AfterViewInit, OnDestroy {
  errorMessage = '';
  allBudget: Budget[] = [];
  titles = [];
  budget = [];
  expenses = [];
  colors = [];

  idleState = 'NOT_STARTED';
  timedOut = false;
  lastPing?: Date = null;
  progressBarPopup: NgbModalRef;

  constructor(public dataService: DataService,
              private route: ActivatedRoute,
              private router: Router,
              public errorService: ErrorService,
              public authService: AuthService,
              private element: ElementRef,
              private idle: Idle,
              private keepalive:
              Keepalive,
              private ngbModal: NgbModal)
  {
    console.log('Timer initiated');
    // sets an idle timeout of 15 minutes.
    idle.setIdle(30);
    // sets a timeout period of 5 minutes.
    idle.setTimeout(10);
    // sets the interrupts like Keydown, scroll, mouse wheel, mouse down, and etc
    idle.setInterrupts([
      new EventTargetInterruptSource(
        this.element.nativeElement, 'keydown DOMMouseScroll mousewheel mousedown touchstart touchmove scroll')]);

    idle.onIdleEnd.subscribe(() => {
      this.idleState = 'NO_LONGER_IDLE';
      console.log('No longer idle');
    });

    idle.onTimeout.subscribe(() => {
      this.idleState = 'TIMED_OUT';
      console.log('Timed out');
      this.timedOut = true;
      this.closeProgressForm();
    });

    idle.onIdleStart.subscribe(() => {
      this.idleState = 'IDLE_START', this.openProgressForm(1);
      console.log('Idle start');
    });

    idle.onTimeoutWarning.subscribe((countdown: any) => {
      this.idleState = 'IDLE_TIME_IN_PROGRESS';
      console.log('Idle time in progress');
      this.progressBarPopup.componentInstance.count = (Math.floor((countdown - 1) / 60) + 1);
      this.progressBarPopup.componentInstance.progressCount = this.reverseNumber(countdown);
      this.progressBarPopup.componentInstance.countMinutes = (Math.floor(countdown / 60));
      this.progressBarPopup.componentInstance.countSeconds = countdown % 60;
    });

    // sets the ping interval to 15 seconds
    keepalive.interval(60);
    /**
     *  // Keepalive can ping request to an HTTP location to keep server session alive
     * keepalive.request('<String URL>' or HTTP Request);
     * // Keepalive ping response can be read using below option
     * keepalive.onPing.subscribe(response => {
     * // Redirect user to logout screen stating session is timeout out if if response.status != 200
     * });
     */
/*


    this.reset();
  }

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
            pointBorderColor: this.colors,
            pointRadius: 5,
            backgroundColor: 'rgba(255, 0, 0, 0.1)'
          },
          {
            label: 'Expenses',
            data: this.expenses,
            pointBorderColor: this.colors,
            pointRadius: 5,
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
            borderWidth: 2,
            borderColor: this.colors,
            type: 'bar',
            fill: false,
            pointRadius: 10
          },
        ],
      },
    });
  }

  addExpense(budget: Budget, expense: number) {
    budget.expenses = +budget.expenses + +expense;
    this.dataService.updateBudget(budget)
    .subscribe({
      next: () => this.onSaveComplete(),
      error: err => this.errorMessage = err
    });
    console.log('Add expense clicked', expense, budget.id);
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    // this.newExpense.reset();
    this.router.navigate(['/dashboard'])
    .then(() => {
      window.location.reload();
    });
  }

  resetExpenses() {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.allBudget.length; i++) {
      this.allBudget[i].expenses = 0;
      this.dataService.updateBudget(this.allBudget[i])
        .subscribe({
          next: () => this.onSaveComplete(),
          error: err => this.errorMessage = err
        });
    }
  }

  ngOnDestroy() {
    this.resetTimeOut();

  }

  reverseNumber(countdown: number) {
    return (10 - (countdown - 1));
  }

  reset() {
    console.log('Timer reset');
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  openProgressForm(count: number) {
    this.progressBarPopup = this.ngbModal.open(TimeoutModalComponent, {
      backdrop: 'static',
      keyboard: false
    });
    this.progressBarPopup.componentInstance.count = count;
    this.progressBarPopup.result.then((result: any) => {
      if (result !== '' && 'logout' === result) {
        this.logout();
      } else {
        this.reset();
      }
    });
  }

  logout() {
    this.resetTimeOut();
  }

  closeProgressForm() {
    this.progressBarPopup.close();
  }

  resetTimeOut() {
    this.idle.stop();
    this.idle.onIdleStart.unsubscribe();
    this.idle.onTimeoutWarning.unsubscribe();
    this.idle.onIdleEnd.unsubscribe();
    this.idle.onIdleEnd.unsubscribe();
  }

}
*/