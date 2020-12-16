import { Component, OnInit } from '@angular/core';
import { NavbarService } from '../services/navbar.service';
import { DataService } from '../services/data.service';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'pb-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
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
    this.signup();
  }


  signup() {
    const creds = {
        username: this.user,
        password: this.passwordHash,
    };
    console.log ('Creds', creds);
    this.dataService.username = this.user;
    this.dataService.postUserData(creds).subscribe((data) => {
      this.signupUser(data);
      console.log('Login data', data);
    });
}

  signupUser(data) {
    if (data.success === true) {
      this.dataService.token = data.token;
      const token = data.token;
      localStorage.setItem('jwt', token);
      console.log('LoginUser data', data);
      // this.navbarService.updateNavAfterAuth('user');
      this.navbarService.updateLoginStatus(true);
      // this.role = this.dataService.username;
    }
  }
}
