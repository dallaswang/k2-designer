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
  selectedModule = {
    module: '',
    table: '',
    data: []
  }
  constructor( private httpService: HttpService) { }
 
  ngOnInit() {
    this.loadData();
  }
  loadData() {
    this.httpService.get('/api/onedataservice/modules', {}).subscribe(result =>{
      this.moduleList = result['Modules'];
      this.moduleList.forEach(item =>{
        const schema = OData.parseMetadata(item.Schema).dataServices.schema;
        const tableList = schema[0].entityType;
        item['tableList'] = tableList;
        item['entityName'] = schema[schema.length-1].entityContainer[0].entitySet[0].name;
        delete item.Schema;
      });
      this.selectedModule.data = this.moduleList;
    })
  }
  backDataSet() {
    this.isSelectedTable = false;
    this.selectedTable = {};
    this.breadcrumbItems = [];
    this.selectedModule.module = '';
    this.selectedModule.table = '';
  }
  selectModule(item) {
    this.breadcrumbItems.push(item.Name);
    this.selectedModule.module = item.Name;
    this.tableList = item.tableList;
    this.isSelectedTable = true;
  }
  selectTable(item) {
    this.selectedModule.table = item.name;
    this.selectedTable = item;
  }
  handleCancel() {
    this.closeEvent.emit(null);
  }
  handleOk() {
    localStorage.setItem('selectedModule', JSON.stringify(this.selectedModule));
    this.closeEvent.emit(true);
  }
}
