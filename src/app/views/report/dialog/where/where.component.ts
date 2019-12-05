import {Component, OnInit, Input, ViewEncapsulation} from '@angular/core';
import { ColumnService } from '../../services/column.service';

@Component({
  selector: 'app-where',
  templateUrl: './where.component.html',
  styleUrls: ['./where.component.less'],
  encapsulation: ViewEncapsulation.None
})

export class WhereComponent implements OnInit {
  // 接收上级的值
  @Input() wherelists: any;
  @Input() parent: any;
  @Input() index: number = 0;
  constructor( private columnService: ColumnService) { }

  ngOnInit() {

  }

  addRule(wherelists) {
    let newWhere = {
      column: '',
      operator: '',
      value: ''
    }
    if (!wherelists.children) {
      wherelists.children = [];
    }
    wherelists.children.push(newWhere);
  }
  deleteRule(list, index) {
    list.children.splice(index, 1);
  }
  addGroup(wherelists) {
    let newGroup = {
      queryType: 'and',
      column: '',
      operator: '',
      value: '',
      children: [{
        column: '',
        operator: '',
        value: ''
      }]
    }
    if (!wherelists.group) {
      wherelists.group = [];
    }
    wherelists.group.push(newGroup);
  }

  deleteGroup(list, index) {
    list.group.splice(index, 1);
  }

  changeQueryType() {
  }

  changeColumn(item) {
    let o = {
      'Edm.String': 'string',
      'Edm.Int32': 'int',
      'Edm.DateTimeOffset': 'date',
      'Edm.DateTime': 'date',
      'Edm.Boolean': 'boolean'
    }
    this.columnService.columnData.forEach(inner =>{
      if(inner.name == item.column) {
        item.colunmType = o[inner.type];
      }
    })
  }
}
