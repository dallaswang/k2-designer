import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.less']
})
export class SidebarComponent implements OnInit {
  isOpen: boolean = false;

  panels: Array<any> = [{
    name: 'aaaaa',
    active: true
  }]
  constructor() { }

  ngOnInit() {
  }

}
