import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './service.config';
@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient, private configService: ConfigService) { }

  get<T>(url: string, params: {}): Observable<T> {
    const headers: HttpHeaders = new HttpHeaders();
    const token = localStorage.getItem('auth');
    headers.append('Content-type', 'application/x-www-form-urlencoded; charset=utf-8');
    headers.append('Authorization', 'Bearer ' + token);

    url = this.configService.baseUrl + url;
    return this.http.get<T>(url, {
      'params': params,
      'headers': headers,
    });
  }

  post<T>(url: string, params: {}): Observable<T> {
    const headers: HttpHeaders = new HttpHeaders();
    const token = localStorage.getItem('auth');
    headers.append('Content-type', 'application/x-www-form-urlencoded; charset=utf-8');
    headers.append('Authorization', 'Bearer ' + token);
    url = this.configService.baseUrl + url;
    return this.http.post<T>(url, params, {
      'headers': headers
    });
  }
}
