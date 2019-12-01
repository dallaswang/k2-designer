import {Component, EventEmitter, OnInit, Input, Output} from '@angular/core';
@Component({
  selector: 'filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.less']
})
export class FilterComponent implements OnInit {
  @Input() fieldType: string;
  @Output() closeEvent = new EventEmitter<any>();
  visible: boolean = true;
  constructor() { }

  ngOnInit() {
  }

  handleOk() {
    this.closeEvent.emit();
  }

  handleCancel() {
    this.closeEvent.emit(false);
  }
}
