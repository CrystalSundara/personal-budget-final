import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { P404Component } from './p404/p404.component';
import { ContactComponent } from './contact/contact.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: HomepageComponent,
  //   pathMatch: 'full'
  // },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
},
{
    path: 'home',
    component: HomepageComponent
},
  {
    path: 'about',
    component: AboutComponent,
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full'
  },
  {
    path: 'contact',
    component: ContactComponent,
    pathMatch: 'full'
  },
  {
    path: '**',
    component: P404Component
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
