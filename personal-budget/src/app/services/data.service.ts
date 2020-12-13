import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError, Subject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { Budget } from './budget';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public chartsJSDataSource = {
    datasets: [
        {
            data: [],
            backgroundColor: [
            '#790149',
            '#005Fcc',
            '#00EBC1',
            '#A700FC',
            '#FF6E3A',
            '#FFDC3D',
            '#00B408',
            '#003D30'
            ],
        }
    ],
    // These labels appear in the legend and in the tooltips when hovering different arcs
    labels: []
    };

    public username;
    public token;
    public errMsg;



    // public d3DataSource = {
    //   labels: [],
    //   values: []
    // };

  constructor(private http: HttpClient) { }


  public getData(): any {
    if (this.chartsJSDataSource.datasets[0].data.length === 0) {
      this.http.get('http://localhost:3000/budget')
      .subscribe((res: any) =>  {
        for (let i = 0; i < res.length; i++) {
          this.chartsJSDataSource.datasets[0].data[i] = res[i].budget;
          this.chartsJSDataSource.labels[i] = res[i].title;
          // this.d3DataSource.values[i] = res[i].budget;
          // this.d3DataSource.labels[i] = res[i].title;
        }
      });
    }
  }

  getChartData(): Observable<any> {
    return this.http.get('http://localhost:3000/budget');
  }

  // public getUserData(creds): <any> {
  //   // return this.http.post('http://localhost:3000/api/login', creds);
  //   this.http.post('http://localhost:3000/api/login', creds)
  //   .subscribe((res: any) =>  {
  //     // if(res.success === true) {
  //       this.token = res.token;
  //       return res;
  //     // }
  //   });
  // }

  public getUserData(creds): any {
      const response = this.http.post('http://localhost:3000/api/login', creds);
      // this.token = response.token;
      return response;
  }

  // public postLogin (creds): Observable<any> {
  //   return this.http.post('http://localhost:3000/api/login', creds)
  //     .pipe(
  //       catchError(this.handleError(creds))
  //     );
  // }

  public postUserData(creds): any {
    const response = this.http.post('http://localhost:3000/api/signup', creds);
    // this.token = response.token;
    return response;
  }

  public getAllBudgetData(): Observable<Budget[]> {
    return this.http.get<Budget[]>('http://localhost:3000/budget')
    .pipe(
      tap(data => console.log(JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  private handleError(err): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

}
