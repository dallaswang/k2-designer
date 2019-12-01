import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ColumnService } from  './column.service';
@Injectable({
  providedIn: 'root'
})

export class FilterService {
  columnData: Array<any> = [];
  constructor(private http: HttpClient) { }

}
