import { Component, OnInit} from '@angular/core';

import { HttpService } from '../../services/httpRequest.service';
@Component({
  selector: 'report-designer-view',
  templateUrl: './report-designer-view.component.html',
  styleUrls: ['./report-designer-view.component.less']
})
export class ReportDesignerViewComponent implements OnInit {
  constructor( public httpService: HttpService) { }
  nvdOptions;
  nvdData;
  dataSet;
  chartType: string = 'barChart';
  barOptions;
  pieOptions
  pie2Options;
  barData;
  pieData
  ngOnInit() {
    this.nvdOptions = {
      chart: {
        type: 'discreteBarChart',
        height: 500,
        margin : {
          top: 20,
          right: 20,
          bottom: 50,
          left: 55
        },
        x: function(d){return d.label;},
        y: function(d){return d.value;},
        showValues: true,
        valueFormat: function(d){
          return d3.format(',.4f')(d);
        },
        duration: 500,
        xAxis: {
          axisLabel: ''
        },
        yAxis: {
          axisLabel: '',
          axisLabelDistance: -10
        }
      }
    }
    this.nvdData = [
      {
        key: "Cumulative Return",
        values: [
          {
            "label" : "A" ,
            "value" : -29.765957771107
          } ,
          {
            "label" : "B" ,
            "value" : 0
          } ,
          {
            "label" : "C" ,
            "value" : 32.807804682612
          } ,
          {
            "label" : "D" ,
            "value" : 196.45946739256
          } ,
          {
            "label" : "E" ,
            "value" : 0.19434030906893
          } ,
          {
            "label" : "F" ,
            "value" : -98.079782601442
          }
        ]
      }
    ];
    this.dataSet = [{
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park'
    },
    {
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park'
    }];
    this.barOptions = {
      chart: {
        type: 'discreteBarChart',
        height: 500,
        margin : {
          top: 20,
          right: 20,
          bottom: 50,
          left: 55
        },
        x: function(d){return d.label;},
        y: function(d){return d.value;},
        showValues: true,
        valueFormat: function(d){
          return d3.format(',.4f')(d);
        },
        duration: 500,
        xAxis: {
          axisLabel: ''
        },
        yAxis: {
          axisLabel: '',
          axisLabelDistance: -10
        }
      }
    }
    this.barData = [
      {
        key: "Cumulative Return",
        values: [
          {
            "label" : "A" ,
            "value" : -29.765957771107
          } ,
          {
            "label" : "B" ,
            "value" : 0
          } ,
          {
            "label" : "C" ,
            "value" : 32.807804682612
          } ,
          {
            "label" : "D" ,
            "value" : 196.45946739256
          } ,
          {
            "label" : "E" ,
            "value" : 0.19434030906893
          } ,
          {
            "label" : "F" ,
            "value" : -98.079782601442
          }
        ]
      }
    ];

    this.pieOptions = {
      chart: {
        type: 'pieChart',
        height: 500,
        x: function(d){return d.key;},
        y: function(d){return d.y;},
        showLabels: true,
        duration: 500,
        labelThreshold: 0.01,
        labelSunbeamLayout: true,
        legend: {
          margin: {
            top: 5,
            right: 35,
            bottom: 5,
            left: 0
          }
        }
      }
    };
    this.pie2Options = {
      chart: {
        type: 'pieChart',
        height: 500,
        donut: true,
        x: function(d){return d.key;},
        y: function(d){return d.y;},
        showLabels: true,
        pie: {
          startAngle: function(d) { return d.startAngle/2 - Math.PI/2; },
          endAngle: function(d) { return d.endAngle/2 - Math.PI/2; }
        },
        duration: 500,
        labelThreshold: 0.01,
        labelSunbeamLayout: true,
        legend: {
          margin: {
            top: 5,
            right: 35,
            bottom: 5,
            left: 0
          }
        }
      }
    };
    this.pieData = [
      {
        key: "One",
        y: 5
      },
      {
        key: "Two",
        y: 2
      },
      {
        key: "Three",
        y: 9
      },
      {
        key: "Four",
        y: 7
      },
      {
        key: "Five",
        y: 4
      }
    ];
  }
  changeChart(type) {
    this.chartType = type;
    switch (type) {
      case 'pie':
        this.nvdOptions = this.pie2Options;
        this.nvdData = this.pieData;
        break;
      case 'bar':
        this.nvdOptions = this.barOptions;
        this.nvdData = this.barData;
        break;
      default:
        break;
    }
  }
}
