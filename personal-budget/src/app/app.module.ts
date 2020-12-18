import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, NO_ERRORS_SCHEMA, ElementRef } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import {NgIdleKeepaliveModule} from '@ng-idle/keepalive';
import { FormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { HeroComponent } from './hero/hero.component';
import { FooterComponent } from './footer/footer.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ArticleComponent } from './article/article.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { P404Component } from './p404/p404.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { ContactComponent } from './contact/contact.component';
import { D3donutComponent } from './d3donut/d3donut.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SignupComponent } from './signup/signup.component';
import { BudgetEditComponent } from './budget-edit/budget-edit.component';

import { DataService } from './services/data.service';
import { ErrorService } from './services/error.service';
import { NavbarService } from './services/navbar.service';
import { AuthGuard } from './auth.guard';
import { AuthService } from './services/auth.service';
import { TokenInterceptor } from './services/token.interceptor';
import { TimeoutModalComponent } from './services/timeout-modal';



@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HeroComponent,
    FooterComponent,
    HomepageComponent,
    ArticleComponent,
    AboutComponent,
    LoginComponent,
    P404Component,
    BreadcrumbsComponent,
    ContactComponent,
    D3donutComponent,
    DashboardComponent,
    SignupComponent,
    BudgetEditComponent,
    TimeoutModalComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgIdleKeepaliveModule.forRoot()
  ],
  entryComponents: [
    LoginComponent,
    DashboardComponent,
    TimeoutModalComponent
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: ErrorService,
     },
     NavbarService,
     DataService,
     AuthService,
     AuthGuard,
     {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
