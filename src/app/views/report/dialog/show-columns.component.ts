import {Component, EventEmitter, OnInit, Input, Output, ViewEncapsulation} from '@angular/core';

import { ColumnService } from '../services/column.service';

@Component({
  selector: 'show-columns',
  templateUrl: './show-columns.component.html',
  styleUrls: ['./show-columns.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class ShowColumnsComponent implements OnInit {
  @Output() closeEvent = new EventEmitter<any>();

  visible: boolean = true;
  filterStr: string = '';
  selectedNum: number = 0;
  colunmsLen: number = 0;
  dataColumns: Array <any> = [];
  constructor(private columnService: ColumnService) { }

  ngOnInit() {
    this.dataColumns = JSON.parse(JSON.stringify(this.columnService.columnData));
    this.colunmsLen = this.dataColumns.length;
    this.countSelectedNum();
  }
  // 确认
  handleOk() {
    this.columnService.columnData = JSON.parse(JSON.stringify(this.dataColumns));
    this.closeEvent.emit();
  }

  // 关闭窗口
  handleCancel() {
    this.closeEvent.emit();
  }

  // 统计选中数量
  countSelectedNum() {
    let num = 0;
    this.dataColumns.forEach(item => {
      if (item.selected) {
        num++;
      }
    })
    this.selectedNum = num;
  }

  // 全选
  selectAll() {
    this.dataColumns.forEach(item =>{
      item.selected = true;
    });
    this.countSelectedNum();
  }

  // 取消全选
  selectNone() {
    this.dataColumns.forEach(item =>{
      if (!item.disabled) {
        item.selected = false;
      }
    });
    this.countSelectedNum();
  }
  // 刷新
  refreshStatus() {
    this.countSelectedNum();
  }
}
