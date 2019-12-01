import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ColumnService {
  columnData: Array<any> = [];
  constructor(private http: HttpClient) { }

}
