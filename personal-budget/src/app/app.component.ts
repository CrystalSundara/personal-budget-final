import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap/modal/modal.module';
import {Keepalive} from '@ng-idle/keepalive';
import {EventTargetInterruptSource, Idle} from '@ng-idle/core';
import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import { TimeoutModalComponent } from './services/timeout-modal';
import { NavbarService } from './services/navbar.service';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'pb-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit {
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

    console.log('ProgressBarPopup', this.progressBarPopup);

    // sets an idle timeout of in seconds - how long to be idle before showing popup.
    this.idle.setIdle(15);
    // sets a timeout period in seconds - how long to acknowledge the popup.
    this.idle.setTimeout(20);
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
      console.log('ProgressBarPopup', this.progressBarPopup);
      this.progressBarPopup.componentInstance.count = (Math.floor((countdown - 1) / 60) + 1);
      this.progressBarPopup.componentInstance.progressCount = this.reverseNumber(countdown);
      this.progressBarPopup.componentInstance.countMinutes = (Math.floor(countdown / 60));
      this.progressBarPopup.componentInstance.countSeconds = countdown % 60;
    });


    // sets the ping interval to 15 seconds
    this.keepalive.interval(15);

    this.keepalive.onPing.subscribe(() => {
          const sub = this.authService.refreshToken()
          .subscribe(success => {
            if (success) {
              console.log('Keep alive success');
            }
          });
        });


    this.navbarService.getLoginStatus()
    .subscribe((status) => {
      if (status === true) {
        this.reset();
      } else {
        // this.resetTimeOut();
        this.idle.stop();
      }
    });

  }

  ngOnInit() {

  }

  ngOnDestroy() {
    console.log('App component destroy');
    this.resetTimeOut();
    this.navbarService.getLoginStatus().unsubscribe();
  }

  startTimer() {
    console.log('start timer called');
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
    this.progressBarPopup = this.ngbModal.open(TimeoutModalComponent, {
      backdrop: 'static',
      keyboard: false
    });
    this.progressBarPopup.componentInstance.count = count;
    this.progressBarPopup.result.then((result: any) => {
      console.log('pop up result', result);
      if ((result !== '' && 'logout' === result) || result === undefined) {
        this.authService.logout()
        .subscribe(success => {
          if (success) {
            this.router.navigate(['login']);
            // this.resetTimeOut();
          }
        });
      } else {
        this.authService.refreshToken()
        .subscribe(success => {
          if (success) {
            console.log('Refresh tokens successful');
            this.reset();
          }
        });
      }
    });
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
  }
}
