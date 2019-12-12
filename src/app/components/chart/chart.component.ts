import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import {_} from 'underscore';
@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.less']
})
export class ChartComponent implements OnInit, OnChanges {
  @Input() data;
  @Input() chartType;
  @Input() options;
  @Input() xy;
  @Output() chartChange = new EventEmitter();
  nvdOptions;
  nvdData;
  constructor() {

  }

  ngOnInit() {

  }

  ngOnChanges() {
    this.changeChart();
    this.generateChartData();
  }
  generateChartData() {
    this.nvdData = this.applyChartData(this.data);
  }
  changeChart() {
    this.nvdOptions = this.applyChartOptions();
    Object.assign(this.nvdOptions.chart, this.options);
  }

  parseAxises() {
    var axises = [{
      x: this.xy[0],
      y: this.xy[1]
    }];
    return axises;
  }

  parseSunAxises () {
    let axises = this.xy.map((item, index) => {
      const o = {
        x: item,
        y: this.xy[0]
      }
      return o;
    });
    return axises;
  }

  parseOhlcAxises() {
    const o = {};
    this.xy.forEach((item, index) => {
      o[index] = item.name;
    });

    const axises = [{
      x: o,
      y: {}
    }];
    return axises;
  }

  getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  getPropertyByPath(obj, path) {
    if (typeof path === 'string') path = path.split('.');

    if (path.length === 0) return obj;
    return this.getPropertyByPath(obj[path[0]], path.slice(1));
  }

  aggregateDataSource(sourceData, axis) {
    var grouped = _.groupBy(sourceData, (item) => {
        return item[axis.x.name] || '';
      });
    var partKeys = _.keys(grouped);

    switch (axis.y.op) {
      case 'count':
        return partKeys.map((key) => {
          var part = grouped[key];
          return {
            label: key,
            value: part.length
          }
        });
      case 'sum':
        return partKeys.map((key) => {
          var part = grouped[key];
          return {
            label: key,
            value: part.filter((item) => {
              return parseFloat(item[axis.y.name]).toString() != "NaN";
            })
              .reduce(function (a, b) {
                  return a + b[axis.y.name];
                },
                0)
          }
        });
      case 'avg':
        return partKeys.map((key) => {
          var part = grouped[key];
          var sum = part.filter((item) => {
            return parseFloat(item[axis.y.name]).toString() != "NaN";
          })
            .reduce(function (a, b) {
                return a + b[axis.y.name];
              },
              0);

          return {
            label: key,
            value: sum / part.length
          }
        });
      case 'max':
        return partKeys.map((key) => {
          var part = grouped[key];
          var max = part
            .reduce(function (max, cur) {
                return Math.max(max, cur[axis.y.name]);
              },
              -Infinity);

          return {
            label: key,
            value: isNaN(max) ? 0 : max
          }
        });
      case 'min':
        return partKeys.map((key) => {
          var part = grouped[key];
          var min = part
            .reduce(function (max, cur) {
                return Math.min(max, cur[axis.y.name]);
              },
              Infinity);

          return {
            label: key,
            value: isNaN(min) ? 0 : min
          }
        });
    }

    return null;
  }
  aggregateBarDataSource(sourceData, axis) {

    var grouped = _.groupBy(sourceData, (item) => {
        return item[axis.x.name] || '';
      });
    var partKeys = _.keys(grouped);

    switch (axis.y.op) {
      case 'count':
        return partKeys.map((key) => {
          var part = grouped[key];
          return {
            label: key,
            value: part.length
          }
        });
    }
    return null;
  }
  aggregatePieDataSource(sourceData, axis) {

    var grouped = _.groupBy(sourceData, (item) => {
        return this.getPropertyByPath(item, axis.x.name) || '';
      });
    var partKeys = _.keys(grouped);

    switch (axis.y.op) {
      case 'count':
        return partKeys.map((key) => {
          var part = grouped[key];
          return {
            label: key,
            value: part.length
          }
        });
    }

    return null;
  }
  aggregateDonutPieDataSource(sourceData, axis) {

    var grouped = _.groupBy(sourceData, (item) => {
        return this.getPropertyByPath(item, axis.x.name) || '';
      });
    var partKeys = _.keys(grouped);

    switch (axis.y.op) {
      case 'count':
        return partKeys.map((key) => {
          var part = grouped[key];
          return {
            key: key,
            y: part.length
          }
        });
    }
    return null;
  }
  aggregateLineBarDataSource(sourceData, axis) {
    var grouped = _.groupBy(sourceData, (item) => {
        return this.getPropertyByPath(item, axis.x.name) || ''
      });
    var partKeys = _.keys(grouped);

    switch (axis.y.op) {
      case 'count':
        return partKeys.map((key) => {
          var part = grouped[key];
          return [
            key,
            part.length
          ]
        });
    }
    return null;
  }
  aggregateStackedAreaDataSource(sourceData, axis) {

    var grouped = _.groupBy(sourceData, (item) => {
        return this.getPropertyByPath(item, axis.x.name) || ''
      });
    var partKeys = _.keys(grouped);

    switch (axis.y.op) {
      case 'count':
        return partKeys.map((key) => {
          var part = grouped[key];
          return [
            key,
            part.length
          ];
        });
    }
    return null;
  }
  computeAxisValue(sourceData, axis, filter) {
    var partition = sourceData.filter((item) => {
      return item[filter.name] === filter.value;
    });
    switch (axis.op) {
      case 'count':
        return partition.length;
      case 'sum':
        return partition.reduce(function (a, b) {
            return a + b[axis.name];
          },
          0);
      case 'avg':
        var sum = partition.reduce(function (a, b) {
            return a + b[axis.name];
          },
          0);
        return sum / partition.length;
      case 'max':
        var max = partition
          .reduce(function (max, cur) {
              return Math.max(max, cur[axis.name]);
            },
            -Infinity);
        return max;
      case 'min':
        var min = partition
          .reduce(function (max, cur) {
              return Math.min(max, cur[axis.name]);
            },
            Infinity);
        return min;
    }

    return null;
  }
  aggregatCummDataSource(sourceData, axis) {
    var grouped = _.groupBy(sourceData, (item) => {
        return this.getPropertyByPath(item, axis.x.name) || ''
      });
    var partKeys = _.keys(grouped);

    switch (axis.y.op) {
      case 'count':
        return partKeys.map((key) => {
          var part = grouped[key];
          return [
            key,
            part.length
          ]
        });
    }

    return null;
  }
  aggregateXYDataSource(sourceData, axis) {
    var grouped = _.groupBy(sourceData, (item) => {
        return this.getPropertyByPath(item, axis.x.name) || '';
      });
    var partKeys = _.keys(grouped);

    switch (axis.y.op) {
      case 'count':
        return partKeys.map((key) => {
          var part = grouped[key];
          return {
            x: key,
            y: part.length
          }
        });
    }

    return null;
  }
  aggregateBulletDataSource = function(sourceData, axis) {
    var grouped = _.groupBy(sourceData, (item) => { return item[axis.x.name] || '' });
    var partKeys = _.keys(grouped);
    switch (axis.y.op) {
      case 'count':
        return partKeys.map((key) => {
          var part = grouped[key];
          return {
            x: key,
            y: part.length
          };
        });
    }
    return null;
  }

  applyLineOptions() {
    var defaultOptions = {
      chart: {
        type: 'lineChart',
        height: 350,
        useInteractiveGuideline: true,
        showXAxis: true,
        showYAxis: true,
        showLegend: true,
        tooltip: {
          hideDelay: 40,
          enabled: true
        },
        margin: {
          top: 25,
          right: 20,
          bottom: 40,
          left: 55
        },
        xAxis: {
          axisLabel: '',
          tickFormat: function (d) {
            return d;
          }
        },
        yAxis: {
          axisLabel: '',
          tickFormat: function (d) {
          },
          axisLabelDistance: -10
        },
        x: function (d) {
          return d ? d.x : null;
        },
        y: function (d) {
          return d ? d.y : null;
        },
        noData: 'No Data'
      },
      title: {
        enable: true,
        text: '',
        css: {
          'text-align': 'center',
          'font-size': 'medium'
        }
      },
      subtitle: {
        enable: false,
        text: '',
        css: {
          'text-align': 'center',
          'margin': '10px 13px 0px 7px'
        }
      },
      caption: {
        enable: false,
        html: '',
        css: {
          'text-align': 'justify',
          'margin': '10px 13px 0px 7px'
        }
      }
    }

    return defaultOptions;
  }
  applyBarOptions() {
    var defaultOptions = {
      chart: {
        type: 'discreteBarChart',
        duration: 500,
        height: 350,
        showValues: true,
        showLegend: false,
        margin: {
          top: 25,
          right: 20,
          bottom: 50,
          left: 55
        },
        x: function (d) {
          return d ? d.label : null;
        },
        y: function (d) {
          return d ? d.value : null;
        },
        valueFormat: function (d) {
          return d3.format(',.2f')(d);
        },
        tooltip: {
          hideDelay: 40,
          enabled: true
        },
        xAxis: {
          axisLabel: ''
        },
        yAxis: {
          axisLabel: '',
          axisLabelDistance: -10
        },
        noData: 'No Data',
        rectClass: 'discreteBar'
      },
      title: {
        enable: true,
        text: '',
        css: {
          'text-align': 'center',
          'font-size': 'medium'
        }
      },
      subtitle: {
        enable: false,
        text: '',
        css: {
          'text-align': 'center',
          'margin': '10px 13px 0px 7px'
        }
      },
      caption: {
        enable: false,
        html: '',
        css: {
          'text-align': 'justify',
          'margin': '10px 13px 0px 7px'
        }
      }
    }

    return defaultOptions;
  }
  applyPieOptions() {
    var defaultOptions = {
      chart: {
        type: 'pieChart',
        duration: 500,
        height: 350,
        showLegend: true,
        showLabels: false,
        labelThreshold: 0.01,
        labelSunbeamLayout: true,
        legend: {
          margin: {
            top: 5,
            right: 35,
            bottom: 5,
            left: 0
          }
        },
        margin: {
          top: -10,
          right: 0,
          bottom: -30,
          left: 0
        },
        tooltip: {
          hideDelay: 40,
          enabled: true
        },
        x: function (d) {
          return d && d.label ? d.label : '';
        },
        y: function (d) {
          return d && d.value ? d.value : 0;
        },
        noData: ''
      },
      title: {
        enable: true,
        text: '',
        css: {
          'text-align': 'center',
          'font-size': 'medium'
        }
      },
      subtitle: {
        enable: false,
        text: '',
        css: {
          'text-align': 'center',
          'margin': '10px 13px 0px 7px'
        }
      },
      caption: {
        enable: false,
        html: '',
        css: {
          'text-align': 'justify',
          'margin': '10px 13px 0px 7px'
        }
      }
    }

    return defaultOptions;
  }
  applyDonutPieOptions() {
    var defaultOptions = {
      chart: {
        type: 'pieChart',
        duration: 500,
        height: 350,
        showLegend: true,
        showLabels: true,
        labelThreshold: 0.01,
        labelSunbeamLayout: true,
        donutRatio: 0.5,
        donut: true,
        legend: {
          margin: {
            top: 5,
            right: 35,
            bottom: 5,
            left: 0
          }
        },
        margin: {
          top: -30,
          right: 0,
          bottom: -30,
          left: 0
        },
        tooltip: {
          hideDelay: 40,
          enabled: true
        },
        x: function (d) {
          return d && d.key ? d.key : '';
        },
        y: function (d) {
          return d && d.y ? d.y : 0;
        },
        noData: '',

        pie: {
          dispatch: {
            elementClick: function (data) {
            }
          },
          title: '',
          startAngle: function (d) {
            return d.startAngle / 2 - Math.PI / 2
          },
          endAngle: function (d) {
            return d.endAngle / 2 - Math.PI / 2
          }
        },
        callback: function () {
        }
      },
      title: {
        enable: false,
        text: '',
        css: {
          'text-align': 'center',
          'font-size': 'large'
        }
      },
      subtitle: {
        enable: false,
        text: 'click to input subtitle',
        css: {
          'text-align': 'center',
          'margin': '10px 13px 0px 7px'
        }
      },
      caption: {
        enable: false,
        html: '',
        css: {
          'text-align': 'justify',
          'margin': '10px 13px 0px 7px'
        }
      }
    }
    return defaultOptions;
  }
  applyStackedAreaOptions() {
    var defaultOptions = {
      chart: {
        type: 'stackedAreaChart',
        useInteractiveGuideline: false,
        useVoronoi: false,
        clipEdge: true,
        duration: 100,
        showXAxis: true,
        showYAxis: true,
        showLegend: true,
        tooltip: {
          hideDelay: 40,
          enabled: true
        },
        height: 350,
        margin: {
          top: 25,
          right: 20,
          bottom: 30,
          left: 40
        },
        xAxis: {
          showMaxMin: false,
          tickFormat: function (d) {
            if (!!d) {
              return d3.time.format('%x')(new Date(d));
            } else {
              return null;
            }
          }
        },
        yAxis: {
          tickFormat: function (d) {
            if (!!d) {
              return d3.format(',.2f')(d);
            } else {
              return null;
            }
          }
        },
        zoom: {
          enabled: true,
          scaleExtent: [1, 10],
          useFixedDomain: false,
          useNiceScale: false,
          horizontalOff: false,
          verticalOff: true,
          unzoomEventType: 'dblclick.zoom'
        },
        x: function (d) {
          return d[0];
        },
        y: function (d) {
          return d[1];
        },
        noData: ''
      },
      title: {
        enable: true,
        text: '',
        css: {
          'text-align': 'center',
          'font-size': 'medium'
        }
      },
      subtitle: {
        enable: false,
        text: '',
        css: {
          'text-align': 'center',
          'margin': '10px 13px 0px 7px'
        }
      },
      caption: {
        enable: false,
        html: '',
        css: {
          'text-align': 'justify',
          'margin': '10px 13px 0px 7px'
        }
      }
    }

    return defaultOptions;
  }
  applyLinePlusBarOptions() {
    var defaultOptions = {
      'chart': {
        'type': 'linePlusBarChart',
        height: 350,
        'duration': 500,
        showValues: true,
        showLegend: false,
        'margin': {
          'top': 30,
          'right': 75,
          'bottom': 50,
          'left': 75
        },
        rectClass: 'discreteBar',
        x: function (d, i) {
          return i
        },
        valueFormat: function (d) {
          return d3.format(',.2f')(d);
        }
      },
      title: {
        enable: true,
        text: '',
        css: {
          'text-align': 'center',
          'font-size': 'medium'
        }
      }
    }

    return defaultOptions;
  }
  applySunburstOptions() {
    var defaultOptions = {
      'chart': {
        'type': 'sunburstChart',
        'color': d3.scale.category20c(),
        'height': 350,
        'duration': 250
      },
      title: {
        enable: true,
        text: '',
        css: {
          'text-align': 'center',
          'font-size': 'medium'
        }
      }
    }

    return defaultOptions;
  }
  applycumulativeLineOptions() {
    var defaultOptions = {
      chart: {
        'type': 'cumulativeLineChart',
        'height': 350,
        'margin': {
          'top': 25,
          'right': 20,
          'bottom': 50,
          'left': 65
        },
        tooltip: {
          hideDelay: 40,
          enabled: true
        },
        'color': [
          '#1f77b4',
          '#ff7f0e',
          '#2ca02c',
          '#d62728',
          '#9467bd',
          '#8c564b',
          '#e377c2',
          '#7f7f7f',
          '#bcbd22',
          '#17becf'
        ],
        x: function (d) {
          return d[0];
        },
        y: function (d) {
          return d[1] / 100;
        },
        average: function (d) {
          return d.mean / 100;
        },
        'duration': 300,
        'useInteractiveGuideline': true,
        'clipVoronoi': false,
        'xAxis': {},
        'yAxis': {}
      },
      title: {
        enable: true,
        text: '',
        css: {
          'text-align': 'center',
          'font-size': 'medium'
        }
      },
    }

    return defaultOptions;
  }
  applymultiBarOptions() {
    var defaultOptions = {
      'chart': {
        'type': 'multiBarChart',
        height: 350,
        tooltip: {
          hideDelay: 40,
          enabled: true
        },
        'margin': {
          top: 25,
          'right': 20,
          'bottom': 45,
          'left': 45
        },
        'clipEdge': true,
        'duration': 500,
        'stacked': true,
        'xAxis': {
          'axisLabel': '',
          'showMaxMin': false
        },
        'yAxis': {
          'axisLabel': '',
          'axisLabelDistance': -20
        }
      },
      title: {
        enable: true,
        text: '',
        css: {
          'text-align': 'center',
          'font-size': 'medium'
        }
      },
    }

    return defaultOptions;
  }
  applyHistoricalBarOptions() {
    var defaultOptions = {
      'chart': {
        type: 'historicalBarChart',
        height: 350,
        margin : {
          top: 25,
          right: 20,
          bottom: 65,
          left: 50
        },
        x: function(d){return d[0];},
        y: function(d){return d[1]/100000;},
        showValues: true,
        valueFormat: function(d){
          return d3.format(',.1f')(d);
        },
        duration: 100,
        xAxis: {
          axisLabel: '',
          tickFormat: function(d) {
            return d3.time.format('%x')(new Date(d))
          },
          rotateLabels: 30,
          showMaxMin: false
        },
        yAxis: {
          axisLabel: '',
          axisLabelDistance: -10,
          tickFormat: function(d){
            return d3.format(',.1f')(d);
          }
        },
        tooltip: {
          hideDelay: 40,
          enabled: true,
          keyFormatter: function(d) {
            return d3.time.format('%x')(new Date(d));
          }
        },
        zoom: {
          enabled: true,
          scaleExtent: [1, 10],
          useFixedDomain: false,
          useNiceScale: false,
          horizontalOff: false,
          verticalOff: true,
          unzoomEventType: 'dblclick.zoom'
        },
        rectClass: '',
        callback: function () {
        }
      }
    }

    return defaultOptions;
  }
  applyMultiBarHorizontalOptions() {
    var defaultOptions = {
      'chart': {
        type: 'multiBarHorizontalChart',
        height: 350,
        x: function (d) {
          return d.label;
        },
        y: function (d) {
          return d.value;
        },
        showControls: true,
        showValues: true,
        duration: 500,
        tooltip: {},
        xAxis: {
          showMaxMin: false
        },
        yAxis: {
          axisLabel: '',
          tickFormat: function (d) {
            return d3.format(',.2f')(d);
          }
        }
      },
      title: {
        enable: true,
        text: '',
        css: {
          'text-align': 'center',
          'font-size': 'medium'
        }
      }
    }

    return defaultOptions;
  }
  applyScatterOptions() {
    var defaultOptions = {
      'chart': {
        'type': 'scatterChart',
        height: 350,
        'color': [
          '#1f77b4',
          '#ff7f0e',
          '#2ca02c',
          '#d62728',
          '#9467bd',
          '#8c564b',
          '#e377c2',
          '#7f7f7f',
          '#bcbd22',
          '#17becf'
        ],
        'scatter': {
          'onlyCircles': false
        },
        'showDistX': true,
        'showDistY': true,
        'duration': 350,
        'xAxis': {
          'axisLabel': ''
        },
        'yAxis': {
          'axisLabel': '',
          'axisLabelDistance': -5
        },
        'zoom': {
          'enabled': true,
          'scaleExtent': [
            1,
            10
          ],
          'useFixedDomain': false,
          'useNiceScale': false,
          'horizontalOff': false,
          'verticalOff': false,
          'unzoomEventType': 'dblclick.zoom'
        }
      },
      title: {
        enable: true,
        text: '',
        css: {
          'text-align': 'center',
          'font-size': 'medium'
        }
      }
    }

    return defaultOptions;
  }
  applylineWithFocusOptions() {
    var defaultOptions = {
      'chart': {
        type: 'lineWithFocusChart',
        height: 350,
        tooltip: {
          hideDelay: 40,
          enabled: true
        },
        margin: {
          top: 25,
          right: 20,
          bottom: 60,
          left: 40
        },
        duration: 500,
        useInteractiveGuideline: true,
        xAxis: {
          axisLabel: '',
          tickFormat: function (d) {
            return d3.format(',f')(d);
          }
        },
        x2Axis: {
          tickFormat: function (d) {
            return d3.format(',f')(d);
          }
        },
        yAxis: {
          axisLabel: '',
          tickFormat: function (d) {
            return d3.format(',.2f')(d);
          },
          rotateYLabel: false
        },
        y2Axis: {
          tickFormat: function (d) {
            return d3.format(',.2f')(d);
          }
        }
      },
      title: {
        enable: true,
        text: '',
        css: {
          'text-align': 'center',
          'font-size': 'medium'
        }
      }
    }
    return defaultOptions;
  }
  applyBulletOptions() {
    var defaultOptions = {
      'chart': {
        'type': 'bulletChart',
        height: 50,
        tooltip: {
          hideDelay: 40,
          enabled: true
        },
        noData: '',
        callback: function () {
        }
      },
      title: {
        enable: false,
        html:
          '<div id="chartTitlePlaceHolder">&nbsp;</div>',
        css: {
          'text-align': 'center',
          'font-size': 'large',
          'margin-bottom': '15px'
        }
      },
      subtitle: {
        enable: false,
        text: 'click to input subtitle',
        css: {
          'text-align': 'center',
          'margin': '10px 13px 0px 7px'
        }
      },
      caption: {
        enable: false,
        html: '',
        css: {
          'text-align': 'justify',
          'margin': '10px 13px 0px 7px'
        }
      }
    }
    return defaultOptions;
  }
  applySparklineOptions() {
    var defaultOptions = {
      'chart': {
        type: 'sparklinePlus',
        height: 350,
        tooltip: {
          hideDelay: 40,
          enabled: true
        },
        x: function (d, i) {
          return i;
        },
        xTickFormat: function (d) {
        },
        duration: 250
      },
      title: {
        enable: true,
        text: '',
        css: {
          'text-align': 'center',
          'font-size': 'medium'
        }
      }
    }

    return defaultOptions;
  }
  applyParallelCoordinatesOptions() {
    var defaultOptions = {
      'chart': {
        'type': 'parallelCoordinates',
        height: 350,
        tooltip: {
          hideDelay: 40,
          enabled: true
        },
        'margin': {
          'top': 30,
          'right': 0,
          'bottom': 10,
          'left': 0
        },
        'dimensionData': []
      },
      title: {
        enable: true,
        text: '',
        css: {
          'text-align': 'center',
          'font-size': 'medium'
        }
      }
    }

    return defaultOptions;
  }
  applyMultiOptions() {
    var defaultOptions = {
      'chart': {
        'type': 'multiChart',
        height: 350,
        'margin': {
          'top': 30,
          'right': 60,
          'bottom': 50,
          'left': 70
        },
        'color': [
          '#1f77b4',
          '#ff7f0e',
          '#2ca02c',
          '#d62728',
          '#9467bd',
          '#8c564b',
          '#e377c2',
          '#7f7f7f',
          '#bcbd22',
          '#17becf'
        ],
        'duration': 500,
        'xAxis': {},
        'yAxis1': {},
        'yAxis2': {}
      },
      title: {
        enable: true,
        text: '',
        css: {
          'text-align': 'center',
          'font-size': 'medium'
        }
      }
    }

    return defaultOptions;
  }
  applyCandlestickBarOptions() {
    var defaultOptions = {
      'chart': {
        'type': 'candlestickBarChart',
        height: 350,
        'margin': {
          top: 25,
          'right': 20,
          'bottom': 40,
          'left': 60
        },
        x: function (d) {
          return d['date'];
        },
        y: function (d) {
          return d['close'];
        },
        duration: 100,
        xAxis: {
          axisLabel: '',
          tickFormat: function (d) {
            return d3.time.format('%x')(new Date(d));
          },
          showMaxMin: false
        },

        yAxis: {
          axisLabel: '',
          tickFormat: function (d) {
            return '$' + d3.format(',.1f')(d);
          },
          showMaxMin: false
        },
        'zoom': {
          'enabled': true,
          'scaleExtent': [
            1,
            10
          ],
          'useFixedDomain': false,
          'useNiceScale': false,
          'horizontalOff': false,
          'verticalOff': true,
          'unzoomEventType': 'dblclick.zoom'
        }
      },
      title: {
        enable: true,
        text: '',
        css: {
          'text-align': 'center',
          'font-size': 'medium'
        }
      }
    }

    return defaultOptions;
  }
  applyOhlcBarOptions() {
    var defaultOptions = {
      'chart': {
        'type': 'ohlcBarChart',
        height: 350,
        'margin': {
          top: 25,
          'right': 20,
          'bottom': 40,
          'left': 60
        },
        x: function (d) {
          return d['date'];
        },
        y: function (d) {
          return d['close'];
        },
        duration: 100,
        xAxis: {
          axisLabel: '',
          tickFormat: function (d) {
            return d3.time.format('%x')(new Date(d));
          },
          showMaxMin: false
        },
        'yAxis': {},
        'zoom': {
          'enabled': true,
          'scaleExtent': [
            1,
            10
          ],
          'useFixedDomain': false,
          'useNiceScale': false,
          'horizontalOff': false,
          'verticalOff': true,
          'unzoomEventType': 'dblclick.zoom'
        }
      },
      title: {
        enable: true,
        text: '',
        css: {
          'text-align': 'center',
          'font-size': 'medium'
        }
      }
    }

    return defaultOptions;
  }
  applyBoxPlotOptions() {
    var defaultOptions = {
      'chart': {
        'type': 'boxPlotChart',
        height: 350,
        'margin': {
          'top': 25,
          'right': 20,
          'bottom': 30,
          'left': 50
        },
        'color': [
          'darkblue',
          'darkorange',
          'green',
          'darkred',
          'darkviolet'
        ],
        'maxBoxWidth': 55,
        'yDomain': [
          0,
          500
        ]
      },
      title: {
        enable: true,
        text: '',
        css: {
          'text-align': 'center',
          'font-size': 'medium'
        }
      }
    }

    return defaultOptions;
  }
  applyForceDirectedOptions() {
    var color = d3.scale.category20();
    var defaultOptions = {
      'chart': {
        'type': 'forceDirectedGraph',
        height: 350,
        width: (function() { return nv.utils.windowSize().width - 450 })(),
        margin: { top: 25, right: 20, bottom: 20, left: 20 },
        color: function(d) {
          return color(d.group);
        },
        nodeExtras: function(node) {
          node &&
          node
            .append('text')
            .attr('dx', 8)
            .attr('dy', '.35em')
            .text(function(d) { return d.name })
            .style('font-size', '10px');
        },
        tooltip: {
          hideDelay: 40,
          enabled: true
        },
        noData: '',
        callback: function() {
        },
        dispatch: {
          renderEnd: function() {
          }
        }
      },
      title: {
        enable: true,
        html:
          '<div id="chartTitlePlaceHolder">&nbsp;</div>',
        css: {
          'text-align': 'center',
          'font-size': 'large'
        }
      },
      subtitle: {
        enable: false,
        text: 'click to input subtitle',
        css: {
          'text-align': 'center',
          'margin': '10px 13px 0px 7px'
        }
      },
      caption: {
        enable: false,
        html: '',
        css: {
          'text-align': 'justify',
          'margin': '10px 13px 0px 7px'
        }
      }
    }

    return defaultOptions;
  }
  applyLineData(sourceData) {
    // var opts = JSON.parse(vm.options.ChartOptions).options;
    var coordinates = this.parseAxises();
    var data = [];

    coordinates.forEach((axis) => {
      var values = [];
      if((axis.y && !axis.y.hasOwnProperty('op'))) {
        sourceData
          .map((item) => {
            return {
              x: axis.x && axis.x.name
                ? item[axis.x.name]
                : axis.x,
              y: axis.y && axis.y.name
                ? item[axis.y.name]
                : axis.y
            }
          });

        values = values.filter((item) => {
          return parseFloat(item.x).toString() != "NaN" && parseFloat(item.y).toString() != "NaN";

        });
      } else {
        values = this.aggregateXYDataSource(sourceData, axis);
      }

      if (values.length === 0) {
        values = [[]];
      }

      var optField = {};

      data.push({
        values: values,
        key: coordinates[0].x.name,
        xField: axis.x,
        yField: axis.y,
        area: false,
        color: "#1f77b4"
      });
    });


    return data;
  }
  applyBarData(sourceData) {
    var axises = this.parseAxises();
    var data = [];

    axises.forEach((axis) => {
      var values;

      if (!axis.x ||
        !axis.x.name ||
        !axis.y ||
        !axis.y.name ||
        !axis.y.hasOwnProperty('op')) {
        values = sourceData
          .map((item) => {
            return {
              label: axis.x && axis.x.name ? item[axis.x.name] : null,
              value: axis.y && axis.y.name ? item[axis.y.name] : null
            };
          });
      } else {
        values = this.aggregateBarDataSource(sourceData, axis);
      }

      values = values.filter((item) => {
        return parseFloat(item.value).toString() != "NaN";
      });

      if (values.length === 0) {
        values = [{value: null}];
      }

      Array.prototype.push.apply(data, values);
    });

    return [
      {
        /*key can be omitted, it's shown as legend, but it actually does not make sense*/
        key: new Date().valueOf(),
        values: data
      }
    ];
  }
  applyPieData(sourceData) {
    var axises = this.parseAxises();
    var data = [];

    axises.forEach((axis) => {
      var values;

      if (!axis.x ||
        !axis.x.name ||
        !axis.y ||
        !axis.y.name ||
        !axis.y.hasOwnProperty('op')) {
        values = sourceData.map((item) => {
            return {
              key: axis.x && axis.x.name ? item[axis.x.name] : null,
              y: axis.y && axis.y.name ? item[axis.y.name] : null,
              xField: axis.x,
              yField: axis.y
            };
          });
      } else {
        values = this.aggregatePieDataSource(sourceData, axis);
      }

      Array.prototype.push.apply(data, values);
    });

    return data;
  }
  applyDonutPieData(sourceData) {
    var axises = this.parseAxises();
    var data = [];

    axises.forEach((axis) => {
      var values;

      if (!axis.x ||
        !axis.x.name ||
        !axis.y ||
        !axis.y.name ||
        !axis.y.hasOwnProperty('op')) {
        values = sourceData
          .map((item) => {
            return {
              key: axis.x && axis.x.name ? item[axis.x.name] : null,
              y: axis.y && axis.y.name ? item[axis.y.name] : null,
              xField: axis.x,
              yField: axis.y
            };
          });
      } else {
        values = this.aggregateDonutPieDataSource(sourceData, axis);
      }

      Array.prototype.push.apply(data, values);
    });
    return data;
  }
  applyStackedAreaData(sourceData) {
    var axises = this.parseAxises();
    var data = [];


    axises.forEach((axis) => {
      var values;

      if (!axis.x ||
        !axis.x.name ||
        !axis.y ||
        !axis.y.name ||
        !axis.y.hasOwnProperty('op')) {
        values = sourceData
          .map((item) => {
            return [
              axis.x && axis.x.name ? item[axis.x.name] : null,
              axis.y && axis.y.name ? item[axis.y.name] : null
            ];
          });
      } else {
        values = this.aggregateStackedAreaDataSource(sourceData, axis);
      }

      var dataItem = {
        values: values,
        key: 'Area ' + (data.length + 1),
        xField: axis.x,
        yField: axis.y,
        color: (axis.y ? axis.y.color : undefined),
        //HACK: to fix an issue where color is not changed
        color1: '#d62728'
      }

      data.push(dataItem);
    });

    return data;
  }
  applyLinePlusBarData(sourceData) {
    var axises = this.parseAxises();
    var data = [];

    axises.forEach((axis) => {
      var values;
      if ((axis.y && !axis.y.hasOwnProperty('op'))) {
        values = sourceData.map((item) => {
          return [
            axis.x && axis.x.name ? item[axis.x.name] : null,
            axis.y && axis.y.name ? parseInt(item[axis.y.name]) : null
          ];
        });
      } else {
        values = this.aggregateLineBarDataSource(sourceData, axis);
      }
      var o = {
        'key': axis.y ? axis.y.name : '',
        'values': values
      }
      if (axis.x.linebarType == 'true') {
        o['bar'] = true;
      }
      data.push(o);
    });
    data = data.map(function(series) {
      series.values = series.values.map(function(d) { return {x: d[0], y: d[1] } });
      return series;
    });
    return data;
  }
  applySunburstData(sourceData) {
    var axises = this.parseSunAxises();
    var data = [];

    function getData(data, axises) {
      var map = {};
      var dest = [];
      if(!axises.x || !axises.y){
        return dest;
      }
      for(var i = 0; i < data.length; i++){
        var ai = data[i];
        if (!map[ai[axises.x.name]]) {
          if(!ai['name']) {
            ai['name'] = axises.y.name + '-' + ai[axises.x.name] + i;
          }
          ai['size'] = ai[axises.y.name];
          dest.push({
            name: ai[axises.x.name],
            children: [ai]
          });
          map[ai[axises.x.name]] = ai;
        } else {
          for(var j = 0; j < dest.length; j++){
            var dj = dest[j];
            if(!ai['name']) {
              ai['name'] = axises.y.name + '-' + ai[axises.x.name] + i;
            }
            ai['size'] = ai[axises.y.name];
            if (dj.name == ai[axises.x.name]) {
              dj.children.push(ai);
              break;
            }
          }
        }
      }
      return dest;
    }

    function recursion(arr, index, axises) {
      arr.children = getData(arr.children, axises[index]);
      if (arr.children.length == 1) {
        arr = arr.children[0];
      }
      if (arr.children.length > 1 && arr.children && axises.length - 1 > index) {
        arr.children.forEach(inner => {
          index = index + 1;
          if (axises[index] && axises[index].x.name) {
            recursion(inner, index, axises);
          }
        })
      }
    }

    if (axises[0]) {
      data = getData(sourceData, axises[0]);
      data.forEach((item, index) => {
        if (axises[1]) {
          recursion(item, 1, axises);
        }
      })
    }
    var data2 = [{
      name: axises[0] && axises[0].x.name,
      children: data
    }];
    return data2;
  }
  applycumulativeLineData(sourceData) {
    var axises = this.parseAxises();
    var data = [];
    axises.forEach((axis) => {
      var values;
      let mean = 0;
      if ((axis.y && !axis.y.hasOwnProperty('op'))) {
        values = sourceData.map((item) => {
          mean = mean + parseInt(item[axis.y.name]);
          return [
            axis.x && axis.x.name ? item[axis.x.name] : null,
            axis.y && axis.y.name ? parseInt(item[axis.y.name]) : null
          ];
        });
      } else {
        values = this.aggregatCummDataSource(sourceData, axis);
      }
      var o = {
        'key': axis.y ? axis.y.name : '',
        'values': values,
        'mean': mean / sourceData.length
      }
      data.push(o);
    });
    return data;
  }
  applymultiBarData(sourceData) {
    var axises = this.parseAxises();
    var data = [];
    axises.forEach((axis) => {
      var values;
      if ((axis.y && !axis.y.hasOwnProperty('op'))) {
        values = sourceData
          .map((item) => {
            return [
              axis.x && axis.x.name ? item[axis.x.name] : null,
              axis.y && axis.y.name ? parseInt(item[axis.y.name]) : null
            ];
          });
      } else {
        values = this.aggregatCummDataSource(sourceData, axis);
      }
      var o = {
        'key': axis.y ? axis.y.name : '',
        'values': values
      }
      data.push(o);
    });
    data = data.map(function (series) {
      series.values = series.values.map(function (d) {
        return {x: d[0], y: d[1]}
      });
      return series;
    });
    return data;
  }
  applyHistoricalBarData(sourceData) {
    var axises = this.parseAxises();
    var data = [];
    axises.forEach((axis) => {
      var values;
      if ((axis.y && !axis.y.hasOwnProperty('op'))) {
        values = sourceData
          .map((item) => {
            return [
              axis.x && axis.x.name ? item[axis.x.name] : null,
              axis.y && axis.y.name ? parseInt(item[axis.y.name]) : null
            ];
          });
      } else {
        values = this.aggregatCummDataSource(sourceData, axis);
      }
      var o = {
        'key': axis.y ? axis.y.name : '',
        'bar': true,
        'values': values
      }
      data.push(o);
    });
    return data;
  }
  applyMultiBarHorizontalData(sourceData) {
    var axises = this.parseAxises();
    var data = [];
    axises.forEach((axis, index) => {
      var values;
      if ((axis.y && !axis.y.hasOwnProperty('op'))) {
        values = sourceData
          .map((item) => {
            return {
              label: axis.x && axis.x.name ? item[axis.x.name] : null,
              value: axis.y && axis.y.name ? parseInt(item[axis.y.name]) : null
            };
          });
      } else {
        values = this.aggregateDataSource(sourceData, axis);
      }
      var color = '#d62728';
      if (index == 1) {
        color = '#1f77b4';
      }
      var o = {
        'key': axis.y ? axis.y.name : '',
        'color': color,
        'values': values
      }
      data.push(o);
    })
    return data;
  }
  applyScatterData(sourceData) {
    var coordinates = this.parseAxises();
    var data = [];
    var shapes = ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'];

    coordinates.forEach((axis) => {
      var values = sourceData
        .map((item) => {
          if (!axis.y || !axis.y.hasOwnProperty('op')) {
            return {
              x: axis.x && axis.x.name ? item[axis.x.name] : null,
              y: axis.y && axis.y.name ? item[axis.y.name] : null,
              size: Math.random(),
              shape: shapes[this.getRandomIntInclusive(0, shapes.length - 1)]
            };
          } else {
            return {
              x: axis.x && axis.x.name ? item[axis.x.name] : null,
              y: this.computeAxisValue(sourceData, axis.y,
                { name: axis.x.name, value: item[axis.x.name] }),
              size: Math.random(),
              shape: shapes[this.getRandomIntInclusive(0, shapes.length - 1)]
            };
          }
        });

      var existing = this.parseAxises();

      var dataItem = {
        values: values,
        key: 'Group' + ' ' + (data.length + 1),
        xField: axis.x,
        yField: axis.y,
        color: (axis.y ? axis.y.color : undefined),
        //HACK: to fix an issue where color is not changed
        color1: '#d62728'
      }

      data.push(dataItem);
    });

    return data;
  }
  applylineWithFocusData(sourceData) {
    var axises = this.parseAxises();
    var data = [];
    axises.forEach((axis) => {
      var values;
      if ((axis.y && !axis.y.hasOwnProperty('op'))) {
        values = sourceData
          .map((item) => {
            return [
              axis.x && axis.x.name ? item[axis.x.name] : null,
              axis.y && axis.y.name ? parseInt(item[axis.y.name]) : null
            ];
          });
      } else {
        values = this.aggregatCummDataSource(sourceData, axis);
      }
      var o = {
        'key': axis.y ? axis.y.name : '',
        'values': values
      }
      data.push(o);
    });
    data = data.map(function (series) {
      series.values = series.values.map(function (d) {
        return {x: d[0], y: d[1]}
      });
      return series;
    });
    return data;
  }
  applyBulletData(sourceData) {
    var coordinates = this.parseAxises();
    var data = [];

    coordinates.forEach(function(axis) {

      var values;

      if (!axis.x || !axis.y || !axis.y.hasOwnProperty('op')) {
        values = sourceData
          .map(function(item) {
            return {
              x: axis.x && axis.x.name ? item[axis.x.name] : null,
              y: axis.y && axis.y.name ? item[axis.y.name] : null
            };
          });
      } else {
        values = this.aggregateBulletDataSource(sourceData, axis);
      }

      var dataItems = values.map(function(item) {
        var ranges = item.y ? [0, item.y] : [0, 1];
        var markers = item.y ? [item.y / 2] : [0];
        var measures = item.y ? [item.y / 2] : [0];

        var dataItem = {
          ranges: ranges,
          title: item.x,
          markers: markers,
          measures: measures,
          xField: axis.x,
          yField: axis.y
        }

        return {
          // options: angular.copy(vm.options),
          data: dataItem
        }
      });

      Array.prototype.push.apply(data, dataItems);
    });
    return data;
  }
  applySparklineData(sourceData) {
    var axises = this.parseAxises();
    var data = [];
    axises.forEach((axis) => {
      var values;
      if ((axis.y && !axis.y.hasOwnProperty('op'))) {
        values = sourceData
          .map((item) => {
            return {
              x: axis.x && axis.x.name ? item[axis.x.name] : null,
              y: axis.y && axis.y.name ? parseInt(item[axis.y.name]) : null
            };
          })
      } else {
        values = this.aggregateXYDataSource(sourceData, axis);
      }
      data = values;
    })
    return data;
  }
  applyParallelCoordinatesData(sourceData) {
    var axises = this.parseAxises();
    var data = [];
    var axiosArray = axises.map(item => {
      return item.y.field;
    })

    sourceData.forEach(item => {
      var object = {};
      object['name'] = item[axises[0].x.field];
      axiosArray.forEach(inner => {
        object[inner] = item[inner];
      })
      data.push(object);
    })
    return data;
  }
  applyMultiData(sourceData) {
    var axises = this.parseAxises();
    var data = [];
    axises.forEach((axis) => {
      var values = [];
      if ((axis.y && !axis.y.hasOwnProperty('op'))) {
        values = sourceData
          .map((item) => {
            return {
              x: axis.x && axis.x.name
                ? item[axis.x.name]
                : axis.x,
              y: axis.y && axis.y.name
                ? item[axis.y.name]
                : axis.y
            }
          });

        values = values.filter((item) => {
          return parseFloat(item.x).toString() != "NaN" && parseFloat(item.y).toString() != "NaN";
        });
      } else {
        values = this.aggregateXYDataSource(sourceData, axis);
      }

      if (values.length === 0) {
        values = [[]];
      }

      var existing = this.parseAxises();

      data.push({
        values: values,
        key:  'stream' + ' ' + (data.length + 1),
        type: axis.x.multiType
      });
    });
    var len = data.length;
    data.forEach((item, index) => {
      if (len / 2 > index) {
        item.yAxis = 1;
      } else {
        item.yAxis = 2;
      }
    })
    return data;
  }
  applyCandlestickBarData(sourceData) {
    var axises = this.parseAxises();
    var data = [];
    axises.forEach((axis) => {
      var values;
      values = sourceData
        .map((item) => {
          return {
            'date': new Date(item[axis.x['designDate']]).getTime(),
            'open': parseFloat(item[axis.x['designOpen']]),
            'high': parseFloat(item[axis.x['designHigh']]),
            'low': parseFloat(item[axis.x['designLow']]),
            'close': parseFloat(item[axis.x['designClose']]),
            'volume': item[axis.x['designVolume']]
          };
        })
      var o = {
        values: values
      }
      data.push(o);
    })
    return data;
  }
  applyOhlcBarData(sourceData) {
    var axises = this.parseOhlcAxises();
    var data = [];
    axises.forEach((axis) => {
      var values;
      values = sourceData
        .map((item) => {
          return {
            'date': new Date(item[axis.x[0]]).getTime(),
            'high': parseFloat(item[axis.x[1]]),
            'low': parseFloat(item[axis.x[2]]),
            'open': parseFloat(item[axis.x[3]]),
            'close': parseFloat(item[axis.x[4]]),
          };
        })
      var o = {
        values: values
      }
      data.push(o);
    })
    return data;
  }
  applyBoxPlotData(sourceData) {
    var axises = this.parseAxises();
    var calcQ1 = function (arr) {
      var len = arr.length;
      var position = (len + 1) / 4;
      var ceilP = Math.ceil(position);
      var floorP = Math.floor(position);
      var minSize = ceilP - position;
      var maxSize = position - floorP;
      var Q1 = minSize * arr[floorP - 1] + maxSize * arr[ceilP - 1];
      return Q1;
    }
    var calcQ2 = function (arr) {
      var len = arr.length;
      var position = 2 * (len + 1) / 4;
      var ceilP = Math.ceil(position);
      var floorP = Math.floor(position);
      var minSize = ceilP - position;
      var maxSize = position - floorP;
      var Q2 = minSize * arr[floorP - 1] + maxSize * arr[ceilP - 1];
      return Q2;
    }
    var calcQ3 = function (arr) {
      var len = arr.length;
      var position = 3 * (len + 1) / 4;
      var ceilP = Math.ceil(position);
      var floorP = Math.floor(position);
      var minSize = ceilP - position;
      var maxSize = position - floorP;
      var Q3 = minSize * arr[floorP - 1] + maxSize * arr[ceilP - 1];
      return Q3;
    }
    var low = function (Q1, Q3) {
      var LQR = Q3 - Q1;
      var low = Q1 - LQR * 1.5;
      return low;
    }
    var high = function (Q1, Q3) {
      var LQR = Q3 - Q1;
      var high = Q3 + LQR * 1.5;
      return high;
    }
    var outliersF = function (arr, Q1, Q3) {
      var out = [];
      arr.filter((item) => {
        if (item < Q1 || item > Q3) {
          out.push(item);
        }
      })
      return out;
    }

    function getBoxPlotData(list) {
      let obj = {};
      axises.forEach((axis) => {
        list.map(item => {
          if (!obj[item[axis.x.field]]) {
            obj[item[axis.x.field]] = [];
          }
          obj[item[axis.x.field]].push(item[axis.y.field]);
          _.sortBy(obj[item[axis.x.field]], axis.y.field);
        })

      })
      var data = [];
      for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
          var Q1 = calcQ1(obj[p])
          var Q2 = calcQ2(obj[p])
          var Q3 = calcQ3(obj[p])
          var whisker_low = low(Q1, Q3);
          var whisker_high = high(Q1, Q3);
          var outliers = outliersF(obj[p], whisker_low, whisker_high);
          var o = {
            'label': p,
            'values': {
              'Q1': Q1,
              'Q2': Q2,
              'Q3': Q3,
              'whisker_low': whisker_low,
              'whisker_high': whisker_high,
              'outliers': outliers
            }
          }
          data.push(o);
        }
      }
      return data;
    }
    let data = getBoxPlotData(sourceData);
    return data;
  }
  applyForceDirectedData(sourceData) {
    var findExistingNode = function (nodes, node) {

      var result = nodes.filter((item) => {
        return item.name === node.name;
      })[0];

      return result ? nodes.indexOf(result) : -1;
    }
    let _this = this;
    var toForceDirectedGraphData = function (data) {
      var nodes = [];
      var links = [];

      data.forEach((item) => {
        var sourceIndex = null;
        var existing;
        if (item.source) {
          existing = findExistingNode(nodes, item.source);
          sourceIndex = existing === -1 ? nodes.push(item.source) - 1 : existing;
        }

        var targetIndex = null;
        if (item.target) {
          existing = findExistingNode(nodes, item.target);
          targetIndex = existing === -1 ? nodes.push(item.target) - 1 : existing;
        }

        if (sourceIndex && targetIndex) {
          links.push({
            source: sourceIndex,
            target: targetIndex,
            value: item.value
          });
        }
      });
      return {nodes: nodes, links: links}
    }

    var generateData = function() {
      var axises = _this.parseAxises();
      var data = [];

      var startingGroup = 0;
      axises.forEach((axis) => {
        if (axis.x && (axis.x.x1 || axis.x.x2)) {
          var values;

          if (!axis.y ||
            !axis.y.name ||
            !axis.y.hasOwnProperty('op')) {
            values = sourceData
              .map((item) => {
                var source =
                  axis.x.x1 && axis.x.x1.name ? item[axis.x.x1.name] : null;
                var target =
                  axis.x.x2 && axis.x.x2.name ? item[axis.x.x2.name] : null;
                var value = axis.y && axis.y.name ? item[axis.y.name] : null;
                var group = startingGroup++;

                return {
                  source: source === null ? null : {
                    name: source,
                    group: group
                  },
                  target: target === null ? null : {
                    name: target,
                    group: group
                  },
                  value: value
                }
              });
          } else {
            values = this.aggregateDataSource(sourceData, axis);
          }

          Array.prototype.push.apply(data, values);
        }
      });

      return toForceDirectedGraphData(data);
    }
    var data = generateData();
    return data;
  }
  applyChartOptions() {
    switch (this.chartType) {
      case 'lineChart':
        return this.applyLineOptions();
      case 'discreteBarChart':
        return this.applyBarOptions();
      case 'pieChart':
        return this.applyPieOptions();
      case 'donutPieChart':
        return this.applyDonutPieOptions();
      case 'stackedAreaChart':
        return this.applyStackedAreaOptions();
      case 'linePlusBarChart':
        return this.applyLinePlusBarOptions();
      case 'sunburstChart':
        return this.applySunburstOptions();
      case 'cumulativeLineChart':
        return this.applycumulativeLineOptions();
      case 'multiBarChart':
        return this.applymultiBarOptions();
      case 'historicalBarChart':
        return this.applyHistoricalBarOptions();
      case 'multiBarHorizontalChart':
        return this.applyMultiBarHorizontalOptions();
      case 'scatterChart':
        return this.applyScatterOptions();
      case 'lineWithFocusChart':
        return this.applylineWithFocusOptions();
      case 'bulletChart':
        return this.applyBulletOptions();
      case 'sparklinePlus':
        return this.applySparklineOptions();
      case 'parallelCoordinates':
        var parallelCoordinatesOptions = this.applyParallelCoordinatesOptions();
        var axises = this.parseAxises();
        var axiosArray = axises.map(item => {
          let o = {
            key: item.y.field
          };
          return o;
        })
        parallelCoordinatesOptions.chart.dimensionData = axiosArray;
        return parallelCoordinatesOptions;
      case 'multiChart':
        return this.applyMultiOptions();
      case 'candlestickBarChart':
        return this.applyCandlestickBarOptions();
      case 'ohlcBarChart':
        return this.applyOhlcBarOptions();
      case 'boxPlotChart':
        return this.applyBoxPlotOptions();
      case 'forceDirectedGraph':
        return this.applyForceDirectedOptions();
      default:
        return null;
    }
  }

  applyChartData(sourceData) {
    switch (this.chartType) {
      case 'lineChart':
        return this.applyLineData(sourceData);
      case 'discreteBarChart':
        return this.applyBarData(sourceData);
      case 'pieChart':
        return this.applyPieData(sourceData);
      case 'donutPieChart':
        return this.applyDonutPieData(sourceData);
      case 'stackedAreaChart':
        return this.applyStackedAreaData(sourceData);
      case 'linePlusBarChart':
        return this.applyLinePlusBarData(sourceData);
      case 'sunburstChart':
        return this.applySunburstData(sourceData);
      case 'cumulativeLineChart':
        return this.applycumulativeLineData(sourceData);
      case 'multiBarChart':
        return this.applymultiBarData(sourceData);
      case 'historicalBarChart':
        return this.applyHistoricalBarData(sourceData);
      case 'multiBarHorizontalChart':
        return this.applyMultiBarHorizontalData(sourceData);
      case 'scatterChart':
        return this.applyScatterData(sourceData);
      case 'lineWithFocusChart':
        return this.applylineWithFocusData(sourceData);
      case 'bulletChart':
        return this.applyBulletData(sourceData);
      case 'sparklinePlus':
        return this.applySparklineData(sourceData);
      case 'parallelCoordinates':
        return this.applyParallelCoordinatesData(sourceData);
      case 'multiChart':
        return this.applyMultiData(sourceData);
      case 'candlestickBarChart':
        return this.applyCandlestickBarData(sourceData);
      case 'ohlcBarChart':
        return this.applyOhlcBarData(sourceData);
      case 'boxPlotChart':
        return this.applyBoxPlotData(sourceData);
      case 'forceDirectedGraph':
        return this.applyForceDirectedData(sourceData);
      default:
        return null;
    }
  }
}
