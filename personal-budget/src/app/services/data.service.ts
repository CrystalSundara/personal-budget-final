import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


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

}
