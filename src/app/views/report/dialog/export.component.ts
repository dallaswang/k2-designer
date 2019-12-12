import {Component, EventEmitter, OnInit, Input, Output, ViewEncapsulation} from '@angular/core';
@Component({
  selector: 'export-file',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class ExportComponent implements OnInit {
  @Output() closeEvent = new EventEmitter<any>();

  exportTitle: string = '';
  visible: boolean = true;

  constructor() { }

  ngOnInit() {
  }

  handleOk() {
    this.closeEvent.emit(this.exportTitle);
  }

  handleCancel() {
    this.closeEvent.emit(null);
  }
}
