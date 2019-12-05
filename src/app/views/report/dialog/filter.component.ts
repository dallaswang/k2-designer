import {Component, EventEmitter, OnInit, Input, Output, ViewEncapsulation} from '@angular/core';
@Component({
  selector: 'filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class FilterComponent implements OnInit {
  @Input() fieldType: string;
  @Output() closeEvent = new EventEmitter<any>();

  visible: boolean = true;
  whereCondition: object = {
    queryType: 'and',
    column: 'Id',
    operator: '',
    value: '',
    group: [],
    children: []
  }
  constructor() { }

  ngOnInit() {
  }

  handleOk() {
    this.closeEvent.emit(this.whereCondition);
  }

  handleCancel() {
    this.closeEvent.emit(false);
  }
}
