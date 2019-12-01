import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'choose-data-sources-list',
  templateUrl: './choose-data-sources-list.component.html',
  styleUrls: ['./choose-data-sources-list.component.less']
})
export class ChooseDataSourcesListComponent implements OnInit {
  constructor() { }

  @Output() closeEvent = new EventEmitter<any>();
  isVisible = true;
  ngOnInit() {
  }
  handleCancel() {
    this.closeEvent.emit(null);
  }
  chooseDataType(type) {
    this.closeEvent.emit(type);
  }

}
