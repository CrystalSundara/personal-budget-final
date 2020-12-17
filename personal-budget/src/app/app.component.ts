// import { Component } from '@angular/core';

// @Component({
//   selector: 'pb-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.scss']
// })
// export class AppComponent {
//   title = 'personal-budget';
// }

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap/modal/modal.module';
import {Keepalive} from '@ng-idle/keepalive';
import {EventTargetInterruptSource, Idle} from '@ng-idle/core';
import {Component, ElementRef, OnDestroy} from '@angular/core';
import { TimeoutModalComponent } from './services/timeout-modal';
import { NavbarService } from './services/navbar.service';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'pb-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'personal-budget';
  idleState = 'NOT_STARTED';
  timedOut = false;
  lastPing?: Date = null;
  progressBarPopup: NgbModalRef;

  constructor(private element: ElementRef,
              private idle: Idle,
              private keepalive: Keepalive,
              private ngbModal: NgbModal,
              private navbarService: NavbarService,
              private authService: AuthService,
              private router: Router) {
    // sets an idle timeout of 15 minutes.
    idle.setIdle(15);
    // sets a timeout period of 5 minutes.
    idle.setTimeout(20);
    // sets the interrupts like Keydown, scroll, mouse wheel, mouse down, and etc
    idle.setInterrupts([
      new EventTargetInterruptSource(
        this.element.nativeElement, 'keydown DOMMouseScroll mousewheel mousedown touchstart touchmove scroll')]);

    this.navbarService.getLoginStatus()
    .subscribe((status) => {
      if (status === true) {
        this.startTimer();
      } else {
        this.resetTimeOut();
      }
    });


    // idle.onIdleEnd.subscribe(() => {
    //   this.idleState = 'NO_LONGER_IDLE';
    //   console.log('No longer idle');
    // });

    // idle.onTimeout.subscribe(() => {
    //   this.idleState = 'TIMED_OUT';
    //   console.log('Timed out');
    //   this.timedOut = true;
    //   this.closeProgressForm();
    // });

    // idle.onIdleStart.subscribe(() => {
    //   this.idleState = 'IDLE_START', this.openProgressForm(1);
    //   console.log('Idle start');
    // });

    // idle.onTimeoutWarning.subscribe((countdown: any) => {
    //   this.idleState = 'IDLE_TIME_IN_PROGRESS';
    //   console.log('Idle time in progress');
    //   this.progressBarPopup.componentInstance.count = (Math.floor((countdown - 1) / 60) + 1);
    //   this.progressBarPopup.componentInstance.progressCount = this.reverseNumber(countdown);
    //   this.progressBarPopup.componentInstance.countMinutes = (Math.floor(countdown / 60));
    //   this.progressBarPopup.componentInstance.countSeconds = countdown % 60;
    // });

    // // sets the ping interval to 15 seconds
    // keepalive.interval(60);
    // /**
    //  *  // Keepalive can ping request to an HTTP location to keep server session alive
    //  * keepalive.request('<String URL>' or HTTP Request);
    //  * // Keepalive ping response can be read using below option
    //  * keepalive.onPing.subscribe(response => {
    //  * // Redirect user to logout screen stating session is timeout out if if response.status != 200
    //  * });
    //  */



    // this.reset();
  }

  ngOnDestroy() {
    console.log('App component destroy');
    this.resetTimeOut();
    this.navbarService.getLoginStatus().unsubscribe();

  }

  startTimer() {
    this.idle.onTimeout.subscribe(() => {
      this.idleState = 'TIMED_OUT';
      console.log('Timed out');
      this.timedOut = true;
      this.closeProgressForm();
    });

    this.idle.onIdleStart.subscribe(() => {
      this.idleState = 'IDLE_START', this.openProgressForm(1);
      console.log('Idle start');
    });

    this.idle.onTimeoutWarning.subscribe((countdown: any) => {
      this.idleState = 'IDLE_TIME_IN_PROGRESS';
      console.log('Idle time in progress');
      this.progressBarPopup.componentInstance.count = (Math.floor((countdown - 1) / 60) + 1);
      this.progressBarPopup.componentInstance.progressCount = this.reverseNumber(countdown);
      this.progressBarPopup.componentInstance.countMinutes = (Math.floor(countdown / 60));
      this.progressBarPopup.componentInstance.countSeconds = countdown % 60;
    });

    this.keepalive.onPing.subscribe(() => {
      // this.idleState = 'IDLE_START', this.openProgressForm(1);
      const sub = this.authService.refreshToken()
      .subscribe(success => {
        if (success) {
          // this.navbarService.updateLoginStatus(true);
          // this.router.navigate(['/dashboard']);
          this.reset();
        }
      });
    });

    // sets the ping interval to 15 seconds
    this.keepalive.interval(15);
    /**
     *  // Keepalive can ping request to an HTTP location to keep server session alive
     * keepalive.request('<String URL>' or HTTP Request);
     * // Keepalive ping response can be read using below option
     * keepalive.onPing.subscribe(response => {
     * // Redirect user to logout screen stating session is timeout out if if response.status != 200
     * });
     */


    // this.keepalive.onPing.subscribe(response => {
    //   console.log('keep alive response', response);
    //   // const countdown = this.idle.getTimeout();
    //   // this.idleState = 'IDLE_TIME_IN_PROGRESS';
    //   // console.log('Idle time in progress');
    //   // this.progressBarPopup.componentInstance.count = (Math.floor((countdown - 1) / 60) + 1);
    //   // this.progressBarPopup.componentInstance.progressCount = this.reverseNumber(countdown);
    //   // this.progressBarPopup.componentInstance.countMinutes = (Math.floor(countdown / 60));
    //   // this.progressBarPopup.componentInstance.countSeconds = countdown % 60;
    //  });

//     this.keepalive.request('http://localhost:3000/api/budget');
// // this event is optional; it allows you to do something with the request's response if you'd like
//     this.keepalive.onPing.subscribe(response => {
//     console.log('Keepalive.ping() response status: ' + response.status);
//   });



    this.reset();
  }

  reverseNumber(countdown: number) {
    return (20 - (countdown - 1));
  }

  reset() {
    console.log ('Timer reset');
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  openProgressForm(count: number) {
    let sub;
    this.progressBarPopup = this.ngbModal.open(TimeoutModalComponent, {
      backdrop: 'static',
      keyboard: false
    });
    this.progressBarPopup.componentInstance.count = count;
    this.progressBarPopup.result.then((result: any) => {
      console.log('pop up result', result);
      // if (result === '') {
      //   this.authService.refreshToken()
      //   .subscribe(success => {
      //     if (success) {
      //       // this.navbarService.updateLoginStatus(true);
      //       // this.router.navigate(['/dashboard']);
      //       this.reset();
      //     }
      //   });
      // } else {
      //   this.authService.logout()
      //   .subscribe(success => {
      //     if (success) {
      //       this.router.navigate(['login']);
      //     }
      //   });
      // }
      if ((result !== '' && 'logout' === result) || result === undefined) {
        sub = this.authService.logout()
        .subscribe(success => {
          if (success) {
            this.router.navigate(['login']);
            this.resetTimeOut();
          }
        });
      } else {
        sub = this.authService.refreshToken()
        .subscribe(success => {
          if (success) {
            // this.navbarService.updateLoginStatus(true);
            // this.router.navigate(['/dashboard']);
            this.reset();
          }
        });
      }
    });
    // sub.unsubscribe();
  }

  logout() {
    this.resetTimeOut();
  }

  closeProgressForm() {
    this.progressBarPopup.close();
  }

  resetTimeOut() {
    console.log('Unsubscribing from timers');
    this.idle.stop();
    this.idle.onIdleStart.unsubscribe();
    this.idle.onTimeoutWarning.unsubscribe();
    this.idle.onIdleEnd.unsubscribe();
    this.idle.onIdleEnd.unsubscribe();
    // this.navbarService.getLoginStatus().unsubscribe();
  }
}
