import {Component, HostListener, OnInit} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  showUserInfo: boolean = false;
  constructor() { }

  ngOnInit() {
  }
  @HostListener('document:click', ['$event'])
  private documentClick(event: Event) {
    this.showUserInfo = false;
  }
  changeUserInfo($event) {
    this.showUserInfo = !this.showUserInfo;
    $event.stopPropagation();
  }
}
