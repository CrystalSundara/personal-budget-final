import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { config } from './../config';
import { Tokens } from '../services/tokens';
import { NavbarService } from './navbar.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly JWT_TOKEN = 'PB_JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'PB_REFRESH_TOKEN';
  private loggedUser: string;

  constructor(private http: HttpClient, private navbarService: NavbarService) {
    navbarService.updateLoginStatus(this.isLoggedIn());
  }

  login(user: { username: string, password: string }): Observable<boolean> {
    return this.http.post<any>(`${config.apiUrl}/login`, user)
      .pipe(
        // tap(tokens => this.doLoginUser(user.username, this.initializeToken(tokens))),
        tap(tokens => this.doLoginUser(user.username, tokens)),
        mapTo(true),
        catchError(error => {
          alert(error.error);
          return of(false);
        }));
  }

  logout() {
    return this.http.post<any>(`${config.apiUrl}/logout`, {
      'refreshToken': this.getRefreshToken()
    }).pipe(
      tap(() => {
        this.doLogoutUser();
        this.navbarService.updateLoginStatus(false);
      }),
      mapTo(true),
      catchError(error => {
        alert(error.error);
        return of(false);
      }));
    // this.navbarService.updateLoginStatus(false);
    // this.doLogoutUser();
  }

  isLoggedIn() {
    // return !!this.getJwtToken();
    return this.tokenValid();
  }

  refreshToken() {
    return this.http.post<any>(`${config.apiUrl}/refresh`, {
      'refreshToken': this.getRefreshToken()
    }).pipe(tap((tokens: Tokens) => {
      this.storeJwtToken(tokens.jwt);
    }));
  }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  tokenValid() {
    if (!!this.getJwtToken()) {
      return !this.tokenExpired();
    } else {
      console.log('No token');
      return false;
    }
  }

  tokenExpired() {
      const token = this.getJwtToken();
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

  getLoggedUser() {
    return this.loggedUser;
  }

  private doLoginUser(username: string, tokens: Tokens) {
    this.loggedUser = username;
    console.log ('Do login token', tokens);
    this.storeTokens(tokens);
    // this.navbarService.updateNavAfterAuth('user');
    this.navbarService.updateLoginStatus(true);
  }

  private doLogoutUser() {
    this.loggedUser = null;
    this.removeTokens();
  }

  private getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  private storeJwtToken(jwt: string) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  private storeTokens(tokens: Tokens) {
    localStorage.setItem(this.JWT_TOKEN, tokens.jwt);
    localStorage.setItem(this.REFRESH_TOKEN, tokens.refreshToken);
  }

  private removeTokens() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }


  // private initializeToken(tokens): Tokens {
  //   return {
  //     jwt: tokens.token,
  //     refreshToken: null
  //   };
  // }
}
