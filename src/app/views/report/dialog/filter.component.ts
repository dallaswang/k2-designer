import {Component, EventEmitter, OnInit, Input, Output, ViewEncapsulation} from '@angular/core';
@Component({
  selector: 'filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class FilterComponent implements OnInit {

  @Output() closeEvent = new EventEmitter<any>();

  visible: boolean = true;
  @Input() whereCondition: object
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
