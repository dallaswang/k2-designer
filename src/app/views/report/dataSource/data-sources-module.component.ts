import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { HttpService } from '../../../services/httpRequest.service';
declare var OData;
@Component({
  selector: 'data-sources-module',
  templateUrl: './data-sources-module.component.html',
  styleUrls: ['./data-sources-module.component.less']
})
export class DataSourcesModuleComponent implements OnInit {
  isVisible: boolean = true;
  @Output() closeEvent = new EventEmitter<any>();
  moduleList = [];
  tableList = [];
  selectedTable = {};
  isSelectedTable = false;
  breadcrumbItems = [];
  selecteModule = {
    module: '',
    table: ''
  }
  constructor( private httpService: HttpService) { }
 
  ngOnInit() {
    this.loadData();
  }
  loadData() {
    this.httpService.get('/api/onedataservice/modules', {}).subscribe(result =>{
      this.moduleList = result.Modules;
      this.moduleList.forEach(item =>{
        const tableList = OData.parseMetadata(item.Schema).dataServices.schema[0].entityType;
        item['tableList'] = tableList;
        delete item.Schema;
      });
    })
  }
  backDataSet() {
    this.isSelectedTable = false;
    this.selectedTable = {};
    this.breadcrumbItems = [];
    this.selecteModule.module = '';
    this.selecteModule.table = '';
  }
  selectModule(item) {
    this.breadcrumbItems.push(item.Name);
    this.selecteModule.module = item.Name;
    this.tableList = item.tableList;
    this.isSelectedTable = true;
  }
  selectTable(item) {
    this.selecteModule.table = item.name;
    this.selectedTable = item;
  }
  handleCancel() {
    this.closeEvent.emit(null);
  }
  handleOk() {
    localStorage.setItem('selecteModule', JSON.stringify(this.selecteModule));
    this.closeEvent.emit(true);
  }
}
