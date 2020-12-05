import { Component, OnInit } from '@angular/core';
import { NavbarService } from '../services/navbar.service';
import { DataService } from '../services/data.service';
import { FormGroup, FormControl } from '@angular/forms';




@Component({
  selector: 'pb-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isLoggedIn = false;
  role = '';
  user;
  passwordHash;
  formdata;

  constructor(private navbarService: NavbarService, private dataService: DataService) {
    this.navbarService.getLoginStatus().subscribe(status => this.isLoggedIn = status);
  }

  ngOnInit() {
    this.formdata = new FormGroup({
      user: new FormControl(''),
      passwd: new FormControl('')
    });
  }
  onClickSubmit(data) {
    this.user = data.user;
    this.passwordHash = data.passwd;
    this.login();
  }


  // login() {
  //   this.navbarService.updateNavAfterAuth('user');
  //   this.navbarService.updateLoginStatus(true);
  //   this.role = 'user';
  // }

  login() {
    const creds = {
        username: this.user,
        password: this.passwordHash,
    };
    console.log ('Creds', creds);
    this.dataService.username = this.user;
    this.dataService.getUserData(creds).subscribe((data) => {
      this.loginUser(data);
      console.log('Login data', data);
    });
}

  loginUser(data) {
    if (true) {
      const token = data.token;
      localStorage.setItem('jwt', token);
      console.log('LoginUser data', data);
      console.log( 'Token expired', tokenExpired(token));
      this.navbarService.updateNavAfterAuth('user');
      this.navbarService.updateLoginStatus(true);
      this.role = this.dataService.username;
    }
  }

  loginAdmin() {
    this.navbarService.updateNavAfterAuth('admin');
    this.navbarService.updateLoginStatus(true);
    this.role = 'admin';
  }

}


function tokenExpired(token) {
  const jwtDecode = JSON.parse(atob(token.split('.')[1]));
  console.log(jwtDecode);
  console.log('Creation time: ', new Date(jwtDecode.iat * 1000));
  console.log('Current time: ', new Date(Date.now()));
  console.log('Expire time: ', new Date(jwtDecode.exp * 1000));
  if (
      token &&
      jwtDecode.exp < Date.now() / 1000
  ) {
      console.log('Token expired');
      return true;
  }
  console.log('Token not expired');
  return false;
}
