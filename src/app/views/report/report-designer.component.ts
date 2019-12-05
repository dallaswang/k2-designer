import { Component, OnInit, ViewEncapsulation, OnChanges} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { HttpService } from '../../services/httpRequest.service';
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
  dataSet;
  chartSettingXY = {
    x: 'X AXIS',
    y: 'Y AXIS',
  }
  currentSortItem: object = {
    sort: 'asc'
  };
  measuresShow: false;
  dmensionsShow: false;
  moduleList = [];
  whereCondition: string;
  selectedTable = {
    property: []
  };
  dialogVisible = {
    filter: false,
    column: false
  };

  selecteModule = {
    module: '',
    table: '',
    data: []
  };
  Url: string = '';
  entityName: string = '';
  reportDesigner = {
    dataSet: true,
    dataTable: true,
    filter: true,
    sort: false,
    chart: true,
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
    rows: 10
  }

  filterStr: string = '';
  sortVisible: boolean = false;

  public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };

  constructor(public http: HttpClient, public httpService: HttpService, private i18n: NzI18nService, private columnService: ColumnService, private odataQueryBuilderService: OdataQueryBuilderService) { }

  ngOnInit() {
    this.i18n.setLocale(en_US);
    this.odataQueryBuilderService.queryBuilder([]);
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
    this.selecteModule = JSON.parse(localStorage.getItem('selecteModule'));
    this.moduleList = this.selecteModule.data;
    // this.httpService.get('/api/onedataservice/modules', {}).subscribe(result =>{
    //   this.moduleList = result.Modules;
    //   this.moduleList.forEach(item =>{
    //     const schema = OData.parseMetadata(item.Schema).dataServices.schema;
    //     const tableList = schema[0].entityType;
    //     item['tableList'] = tableList;
    //     item['entityName'] = schema[schema.length-1].entityContainer[0].entitySet[0].name;
    //     delete item.Schema;
    //   });

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
    // })
  }

  // 查询数据
  getData() {
    let url = `/${this.Url}/${this.entityName}`;
    let top = this.reportData.rows;
    let orderBy = this.odataQueryBuilderService.getSorts(this.reportData.sorts);
    let select  = this.odataQueryBuilderService.joinColumn(this.reportData.selectedColumn);
    const filter = this.whereCondition;

    if(select.length == 0) {
      select = null;
    }
    if(orderBy.length == 0) {
      orderBy = null;
    }
    url = url +  buildQuery({ top, orderBy, filter, select });

    this.httpService.get(url, {}).subscribe((result: any) =>{
      this.dataSet = result['value'];
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
  // 选中哪个chart
  selectChart(type) {
    this.reportDesigner.chartType = type;
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
  // 拖动成功回调
  getDropDemensionItem($event) {
    let name = this.reportData.demensions.name;
    this.reportData.demensions = {};
    this.setSelectColumn(name, $event.dragData.name, this.reportData.measures.name);
    this.reportData.demensions = $event.dragData;
    this.getColumns();
    this.getData();
  }

  // 拖动成功回调
  getDropMeasuresItem($event) {
    let name = this.reportData.measures.name;
    this.reportData.measures = {};
    this.setSelectColumn(name, $event.dragData.name, this.reportData.demensions.name);
    this.reportData.measures = $event.dragData;

    if ( this.reportData.measures.Otype != 'number') {
      this.reportData.measures.op = 'count';
    }
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
    this.setSelectColumn(this.reportData.demensions.name, null, '');
    this.reportData.demensions = {};
    this.getColumns();
    this.getData();
  }

  // 删除y轴
  delMeasures($event) {
    this.setSelectColumn(this.reportData.measures.name, null, '');
    this.reportData.measures = {};
    this.getColumns();
    this.getData();
  }

  // 筛选弹窗关闭
  closeFilterDialog($event) {
    this.dialogVisible.filter = false;
    if($event){
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

  ngOnChanges() {
  }
}
