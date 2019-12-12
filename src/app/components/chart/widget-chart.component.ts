import { Component, OnInit, OnChanges, Input } from '@angular/core';
import {HttpService} from '../../services/httpRequest.service';

@Component({
  selector: 'app-widget-chart',
  templateUrl: './widget-chart.component.html',
  styleUrls: ['./widget-chart.component.less']
})
export class WidgetChartComponent implements OnInit, OnChanges {
  @Input() data;
  tableData: any[] = [];

  reportData: any = {
    chartType: '',
    designArr: [],
    url: ''
  }

  constructor( public httpService: HttpService) {

  }

  ngOnInit() {
   this.parseParams();
   this.getData();
  }

  parseParams() {
    const data = JSON.parse(this.data);
    this.reportData = data.reportData;
  }
  getData() {
    this.httpService.get(this.reportData.url, {}).subscribe((result: any) =>{
      this.tableData = result['value'];
    });
  }
  ngOnChanges() {}
}
