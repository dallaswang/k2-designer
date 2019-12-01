import { Component, OnInit, ViewEncapsulation, OnChanges} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { HttpService } from '../../services/httpRequest.service';
declare var OData;
import buildQuery from 'odata-query';
import { en_US, zh_CN, NzI18nService } from 'ng-zorro-antd/i18n';
import { ColumnService } from './services/column.service';

@Component({
  selector: 'report-designer',
  templateUrl: './report-designer.component.html',
  styleUrls: ['./report-designer.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class ReportDesignerComponent implements OnInit, OnChanges {
  dataSet;
  currentSortItem: object = {
    sort: 'asc'
  };
  moduleList = [];
  selectedTable = {
    property: []
  };
  dialogVisible = {
    filter: true,
    column: false
  };

  selecteModule = {
    module: '',
    table: ''
  };
  Url: string = '';
  entityName: string = '';
  reportDesigner = {
    dataSet: true,
    dataTable: true,
    filter: false,
    sort: false,
    chart: false,
    designerMain: true,
    chartType: ''
  }

  reportData: any = {
    dataSetName: '',
    sizes: [],
    measurements: [],
    filters: [],
    sorts: [],
    demensions: {},
    measures: {},
    selectedColumn: [],
    rows: 0
  }

  filterStr: string = '';
  sortVisible: boolean = false;

  public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };

  constructor(public http: HttpClient, public httpService: HttpService, private i18n: NzI18nService, private columnService: ColumnService) { }

  ngOnInit() {
    this.i18n.setLocale(en_US);

    this.loadData();
  }

  // 区分string字段和number字段
  filterData() {
    this.columnService.columnData = [];
    const charsType = ['Edm.DateTime', 'Edm.DateTimeOffset', 'Edm.String', 'Edm.SByte'];
    const numberType = ['Edm.Decimal', 'Edm.Double'];
    this.reportData.dataSetName = this.selecteModule.module;
    this.selectedTable.property.filter(item => {
      if (charsType.includes(item.type)) {
        item.Otype = 'char';
        this.reportData.sizes.push(item);
      } else if (numberType.includes(item.type)) {
        item.Otype = 'number';
        this.reportData.measurements.push(item);
      }
      this.columnService.columnData.push(item);
    });
    this.getColumns();
  }
  // 加载module模块
  loadData() {
    const filter = { "startswith(PropName, 'foo')": { eq: true }};
    console.log(buildQuery({ filter }));
    this.selecteModule = JSON.parse(localStorage.getItem('selecteModule'));

    this.httpService.get('/api/onedataservice/modules', {}).subscribe(result =>{
      this.moduleList = result.Modules;

      this.moduleList.forEach(item =>{
        const schema = OData.parseMetadata(item.Schema).dataServices.schema;
        const tableList = schema[0].entityType;
        item['tableList'] = tableList;
        item['entityName'] = schema[schema.length-1].entityContainer[0].entitySet[0].name
        delete item.Schema;
      });

      this.moduleList.filter(item =>{
        if (this.selecteModule.module == item.Name) {
          this.Url = item.Url;
          this.entityName = item.entityName;
          item.tableList.filter(inner =>{
            if (this.selecteModule.table == inner.name) {
              this.selectedTable = inner;
            }
          })
        }
      })
      this.filterData();
      this.getData();
    })
  }

  // 查询数据
  getData() {
    let module = this.selecteModule.module.toLowerCase();
    let url = `/${this.Url}/${this.entityName}?$top=100`;
    // reportData.sorts
    // reportData.rows
    // this.columnService.columnData
    console.log(this.reportData.sorts);
    console.log(this.reportData.rows);
    console.log(this.columnService.columnData);

    this.httpService.get(url, {}).subscribe(result =>{
      console.log(result);
      this.dataSet = result.value;
    });
  }
  // 获取所有的字段
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
  // 选中哪个chart
  selectChart(type) {
    this.reportDesigner.chartType = type;
  }

  getDropDemensionItem($event) {
    this.reportData.demensions = $event.dragData;
  }
  getDropMeasuresItem($event) {
    this.reportData.measures = $event.dragData;
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
    this.sortVisible = true;
  }

  showSortDialog(item) {
    this.currentSortItem = item;
    this.sortVisible = true;
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
    this.sortVisible = false;
    this.getData();
  }

  // 删除x轴
  delDemensions($event) {
    this.reportData.demensions = {};
  }

  // 删除y轴
  delMeasures($event) {
    this.reportData.measures = {};
  }

  // 筛选弹窗关闭
  closeFilterDialog($event) {
    this.dialogVisible.filter = false;
  }

  // columns弹窗关闭
  closeColumnsDialog($event) {
    this.getColumns();
    this.getData();
    this.dialogVisible.column = false;
  }

  ngOnChanges() {
  }
}
