import { Component, OnInit } from '@angular/core';
import { NavbarService } from '../services/navbar.service';
import { DataService } from '../services/data.service';


@Component({
  selector: 'pb-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isLoggedIn = false;
  role = '';

  constructor(private navbarService: NavbarService) {
    this.navbarService.getLoginStatus().subscribe(status => this.isLoggedIn = status);
  }

  ngOnInit() {
  }

  login() {
    this.navbarService.updateNavAfterAuth('user');
    this.navbarService.updateLoginStatus(true);
    this.role = 'user';
  }

// login() {
//     const data = {
//         username: document.getElementById('username').value,
//         password: document.getElementById('password').value,
//     };
//     this.dataService.
//     axios.post('/api/login', data)
//     .then(res => {
//         console.log(res);
//         document.getElementById('username').value = '';
//         document.getElementById('password').value = '';
//         if (res && res.data && res.data.success) {
//             const token = res.data.token;
//             localStorage.setItem('jwt', token);
//             this.navbarService.updateNavAfterAuth('user');
//             this.navbarService.updateLoginStatus(true);
//             this.role = 'user';
//         }
//     });
// }

  loginAdmin() {
    this.navbarService.updateNavAfterAuth('admin');
    this.navbarService.updateLoginStatus(true);
    this.role = 'admin';
  }

}
