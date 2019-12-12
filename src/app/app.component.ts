import { Component, OnInit, HostListener } from '@angular/core';
declare var Oidc;
import { HttpService } from './services/httpRequest.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'report-designer';

  constructor(private httpService: HttpService) {}

  ngOnInit() {
  }
}
