import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
const url = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}
  getAssessment(): Promise<any> {
    const accessibility = firstValueFrom(this.http.get(url + '/accessibility'));
    const correctness = firstValueFrom(this.http.get(url + '/correctness'));
    const completeness = firstValueFrom(this.http.get(url + '/completeness'));

    return Promise.all([accessibility, correctness, completeness]);
  }
  getNearbyList(): Observable<any> {
    return this.http.get(url + '/nearby/list');
  }
  getErrors(): Observable<any> {
    return this.http.get(url + '/error-detection');
  }
}
