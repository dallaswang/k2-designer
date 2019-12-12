import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  routerPath: string = '';
  navList: Array<any> = [{
    name: '仪表盘',
    icon: 'dashboard',
    link: ''
  },
  {
    name: '报表',
    icon: 'home',
    link: '/designer/report/reportList'
  },
  {
    name: '设置',
    icon: 'setting',
    link: ''
  }
  ];

  constructor(private router: Router) { }

  ngOnInit() {
    this.routerPath = this.router.url;
    this.router.events.subscribe((data) => {
      if (data instanceof NavigationEnd) {
        this.routerPath = data.url;
      }
    });
  }
}
