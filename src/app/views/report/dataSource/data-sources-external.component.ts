import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'data-sources-external',
  templateUrl: './data-sources-external.component.html',
  styleUrls: ['./data-sources-external.component.less']
})
export class DataSourcesExternalComponent implements OnInit {
  isVisible: boolean = false;

  @Output() closeEvent = new EventEmitter<any>();

  constructor() { }
 
  ngOnInit() {
  }
}
