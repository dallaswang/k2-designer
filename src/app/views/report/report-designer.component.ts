import { Component, OnInit, ViewEncapsulation, OnChanges} from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpService } from '../../services/httpRequest.service';
import { ServiceConfig } from '../../services/service.config';
declare var OData;
import buildQuery from 'odata-query';
import { en_US, zh_CN, NzI18nService } from 'ng-zorro-antd/i18n';
import { ColumnService } from './services/column.service';
import { OdataQueryBuilderService } from './services/odata-query-builder.service';

@Component({
  selector: 'report-designer',
  templateUrl: './report-designer.component.html',
  styleUrls: ['./report-designer.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class ReportDesignerComponent implements OnInit, OnChanges {
  chartSettingXY = {
    x: 'X AXIS',
    y: 'Y AXIS',
  };
  pageId: string;
  chartTemplates = [
    {
      'id': 'line',
      'name': 'Line',
      'type': 'lineChart',
      'icon': 'line-chart',
    },
    {
      'id': 'bar',
      'name': 'Bar',
      'type': 'discreteBarChart',
      'icon': 'bar-chart',
    },
    {

      'id': 'pie',
      'name': 'Pie',
      'type': 'pieChart',
      'icon': 'pie-chart',
    },
    {

      'id': 'donut',
      'name': 'Donut',
      'type': 'donutPieChart',
      'icon': 'icondonut',
    },
    {
      'id': 'area',
      'name': 'Area',
      'type': 'stackedAreaChart',
      'icon': 'area-chart',
    },
    {
      'id': 'linebar',
      'name': 'LineBar',
      'type': 'linePlusBarChart',
      'icon': 'iconline-bar',
    },
    {
      'id': 'sunburst',
      'name': 'Sunburst',
      'type': 'sunburstChart',
      'icon': 'iconsunburst',
    },
    {
      'id': 'cumulativeLineChart',
      'name': 'Cumulative Line',
      'type': 'cumulativeLineChart',
      'icon': 'line-chart',
    },
    {
      'id': 'multiBarChart',
      'name': 'MultiBar',
      'type': 'multiBarChart',
      'icon': 'bar-chart',
    },
    {
      'id': 'historicalBarChart',
      'name': 'HistoricalBar',
      'type': 'historicalBarChart',
      'icon': 'bar-chart',
    },
    {
      'id': 'multiBarHorizontalChart',
      'name': 'MultiBar Horizontal',
      'type': 'multiBarHorizontalChart',
      'icon': 'bar-chart',
    },
    {
      'id': 'scatter',
      'name': 'Scatter',
      'type': 'scatterChart',
      'icon': 'dot-chart',
    },
    {
      'id': 'lineWithFocusChart',
      'name': 'Line With Focus Chart',
      'type': 'lineWithFocusChart',
      'icon': 'line-chart',
    },
    // {
    //     'id': 'bullet',
    //     'name': 'Bullet',
    //     'type': 'bulletChart',
    //     'icon': 'line-chart',
    // },
    {
      'id': 'sparklinePlusChart',
      'name': 'SparklinePlus',
      'type': 'sparklinePlus',
      'icon': 'iconSpark_Line',
    },
    {
      'id': 'parallelCoordinates',
      'name': 'Parallel Coordinates',
      'type': 'parallelCoordinates',
      'icon': 'iconArtboard',
    },
    {
      'id': 'multiChart',
      'name': 'Multi',
      'type': 'multiChart',
      'icon': 'bar-chart',
    },
    {
      'id': 'candlestickBarChart',
      'name': 'CandlestickBar',
      'type': 'candlestickBarChart',
      'icon': 'sliders',
    },
    {
      'id': 'ohlcBarChart',
      'name': 'OhlcBar',
      'type': 'ohlcBarChart',
      'icon': 'sliders',
    },
    {
      'id': 'boxPlot',
      'name': 'BoxPlot',
      'type': 'boxPlotChart',
      'icon': 'box-plot',
    },
    {
      'id': 'forced_directed',
      'name': 'Forced Directed',
      'type': 'forceDirectedGraph',
      'icon': 'dot-chart',
    }
  ];
  filterStr: string = '';
  Url: string = '';
  entityName: string = '';
  scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
  designerHeaderShow: boolean = true;
  currentSortItem: object = {
    sort: 'asc'
  };
  whereConditionMap: object = {
  queryType: 'and',
  column: 'Id',
  operator: '',
  value: '',
  group: [],
  children: []
};
  whereCondition: string;
  selectedTable = {
    property: []
  };
  dialogVisible = {
    filter: false,
    column: false,
    sortVisible: false,
    measuresVisible: false,
    demensionsVisible: false,
  };

  selectedModule = {
    module: '',
    table: '',
    data: []
  };

  reportDesigner = {
    dataSet: true,
    dataTable: false,
    filter: true,
    sort: false,
    chart: true,
    designerMain: true,
    properties: false
  }

  reportData: any = {
    reportTitle: '',
    dataSetName: '',
    sizes: [],
    measurements: [],
    filters: [],
    sorts: [],
    selectedColumn: [],
    rows: 10,
    tableData: [],
    chartType: '',
    designArr: [{}, {}, {}, {}, {}, {}],
    url: '',
    chart: {
      height: 350
    }
  }

  constructor(private activatedRoute: ActivatedRoute, private router: Router,private message: NzMessageService, public httpService: HttpService,
          private i18n: NzI18nService, private serviceConfig: ServiceConfig, private columnService: ColumnService, private odataQueryBuilderService: OdataQueryBuilderService) {
        activatedRoute.params.subscribe(params => {
          if(params.id !== 'new') {
              this.getSetting(params.id);
              this.pageId = params.id;
          } else {
            this.loadData();
          }
        });
}

  ngOnInit() {
    console.log(this.serviceConfig.baseUrl);
    // window.open('https://lab.azaas.com:51024/odata/outcome/JobseekerInterviewOutcomes/oexport?$top=10000000&$format=pdf&filename=daad', '_blank')
    this.i18n.setLocale(en_US);
    this.odataQueryBuilderService.queryBuilder([]);
  }

  // 区分string字段和number字段
  filterData() {
    this.columnService.columnData = [];
    const dateType = ['Edm.DateTime', 'Edm.DateTimeOffset'];
    const charsType = ['Edm.String', 'Edm.SByte'];
    const numberType = ['Edm.Decimal', 'Edm.Double'];
    this.reportData.dataSetName = this.selectedModule.module;
    this.selectedTable.property.filter(item => {
      if (charsType.includes(item.type)) {
        item.Otype = 'char';
        item.icon = 'iconstring';
        this.reportData.sizes.push(item);
      } else if(dateType.includes(item.type)){
        item.Otype = 'date';
        item.icon = 'icondate';
        this.reportData.sizes.push(item);
      } else if (numberType.includes(item.type)) {
        item.Otype = 'number';
        item.icon = 'iconnumber';
        this.reportData.measurements.push(item);
      }
      this.columnService.columnData.push(item);
    });

    this.getColumns();
  }
  // 加载module模块
  loadData() {
    this.selectedModule = JSON.parse(localStorage.getItem('selectedModule'));
    const moduleList = this.selectedModule.data;

    moduleList.filter(item =>{
        if (this.selectedModule.module == item.Name) {
          this.Url = item.Url;
          this.entityName = item.entityName;
          item.tableList.filter(inner =>{
            if (this.selectedModule.table == inner.name) {
              this.selectedTable = inner;
            }
          })
        }
      })
      this.filterData();
      this.getData();
  }

  // 查询数据
  getData() {
    let url = `/${this.Url}/${this.entityName}`;
    let top = this.reportData.rows;
    let orderBy = this.odataQueryBuilderService.getSorts(this.reportData.sorts);
    let select  = this.odataQueryBuilderService.joinColumn(this.reportData.selectedColumn);
    const filter = this.whereCondition;
    url = url +  buildQuery({ top, orderBy, filter, select });
    this.reportData.url = url;
    this.httpService.get(url, {}).subscribe((result: any) =>{
      this.reportData.tableData = result['value'];
    });
  }
  // 获取所有选中的字段
  getColumns() {
    this.reportData.selectedColumn = [];
     this.columnService.columnData.filter(item =>{
        if (item.selected) {
          this.reportData.selectedColumn.push(item);
        }
     });
  }
  // 显示隐藏 Data TABLE FILTER & SORT 块
  showItem(type) {
    this.reportDesigner[type] = !this.reportDesigner[type];
  }

  // 显示隐藏table
  toggleTable() {
    this.reportDesigner.designerMain = !this.reportDesigner.designerMain;
  }
  // 显示隐藏操作栏
  toggleHeader($event) {
    this.designerHeaderShow = !this.designerHeaderShow;
  }
  // 选中哪个chart
  selectChart(type) {
    this.reportData.chartType = type;
    switch (type) {
      case 'pieChart':
      case 'donutPieChart':
        this.chartSettingXY.x = 'PIE NAME';
        this.chartSettingXY.y = 'PIE VALUE';
        break;
      default:
        this.chartSettingXY.x = 'X AXIS';
        this.chartSettingXY.y = 'Y AXIS';
        break;
    }
  }
  // 设置或取消选中字段
  setSelectColumn(name, dragName, existenceName) {
    this.columnService.columnData.forEach(item =>{
      if (item.name == name && existenceName !== name ) {
        item.selected = false;
        item.disabled = false;
      }
      if (item.name == dragName) {
        item.selected = true;
        item.disabled = true;
      }
    });
  }

  // k线图日期
  getDropMeasures($event, index) {
    let name = this.reportData.designArr[index].name;
    this.reportData.designArr[index] = {};
    this.setSelectColumn(name, $event.dragData.name, this.reportData.designArr[index].name);
    this.reportData.designArr[index] = $event.dragData;

    if ( this.reportData.designArr[index].Otype != 'number') {
      this.reportData.designArr[index].op = 'count';
    }
    this.getColumns();
    this.getData();
  }

  delMeasures($event, index) {
    this.setSelectColumn(this.reportData.designArr[index].name, null, '');
    this.reportData.designArr[index] = {};
    this.getColumns();
    this.getData();
  }
  // 切换统计方式回调
  changeCalc() {
    this.getData();
  }
  // 点开设置弹窗
  settingFilter() {
    this.dialogVisible.filter = true;
  }

  // 排序拖放成功回调
  getDropSortItem($event) {
    const includes = this.reportData.sorts.map(item =>{
      return item.name;
    })
    if (!includes.includes($event.dragData.name)) {
      const dragData = JSON.parse(JSON.stringify($event.dragData));
      dragData.sort = 'asc';
      this.currentSortItem = dragData;
      this.reportData.sorts.push(dragData);
    } else {
      let index = includes.indexOf($event.dragData.name);
      this.currentSortItem = this.reportData.sorts[index];
    }
    this.dialogVisible.sortVisible = true;
  }

  showSortDialog(item) {
    this.currentSortItem = item;
    this.dialogVisible.sortVisible = true;
  }
  // 删除排序字段
  delSortsItem($event, index) {
    $event.stopPropagation();
    this.reportData.sorts.splice(index, 1);
  }

  sortChange($event, item) {
    console.log(item);
  }

  // 排序弹窗关闭
  closeSort(type) {
    this.dialogVisible.sortVisible = false;
    this.getData();
  }

  // 筛选弹窗关闭
  closeFilterDialog($event) {
    this.dialogVisible.filter = false;
    if ($event){
      this.whereConditionMap = $event;
      this.whereCondition = this.odataQueryBuilderService.queryBuilder($event);
      this.getData();
    }
  }

  // columns弹窗关闭
  closeColumnsDialog($event) {
    this.getColumns();
    this.getData();
    this.dialogVisible.column = false;
  }

  // 获取页面配置
  getSetting(id) {
    this.httpService.get('/api/onedataservice/reportdesigner/get', {id: id}).subscribe(result => {
      const pageSetting = JSON.parse(result.ReportDesignerData);
      this.reportDesigner = pageSetting.reportDesigner;
      this.reportData = pageSetting.reportData;
      this.whereConditionMap = pageSetting.whereConditionMap;
      this.loadData();
    });
  }
  // 保存页面配置
  save() {
    const pageSetting = {
      reportDesigner : this.reportDesigner,
      reportData: this.reportData,
      whereConditionMap: this.whereConditionMap
    };

    this.httpService.post('/api/onedataservice/reportdesigner/save', {ReportDesignerData: JSON.stringify(pageSetting)}).subscribe(result => {
      this.message.create('success', `Save Successfully`);
      this.router.navigate(['/designer/report/reportDesigner', result]);
    });
  }
  // 更新
  update() {
    const pageSetting = {
      reportDesigner : this.reportDesigner,
      reportData: this.reportData,
      whereConditionMap: this.whereConditionMap
    };

    this.httpService.post('/api/onedataservice/reportdesigner/save', {Id: this.pageId, ReportDesignerData: JSON.stringify(pageSetting)}).subscribe(result => {
      this.message.create('success', `Update Successfully`);
    });
  }
  // 导出报表
  exportReport(type) {}

  ngOnChanges() {
  }
}
