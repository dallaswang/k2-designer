import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../services/httpRequest.service';

@Component({
  selector: 'report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.less']
})
export class ReportListComponent implements OnInit {
  chooseDataDialogVisible: boolean = false;
  dataModuleDialogVisible: boolean = false;
  dataExternalDialogVisible: boolean = false;

  constructor( public router: Router, public httpService: HttpService) { }

  ngOnInit() {
  }
  chooseDataClose($event) {
    this.chooseDataDialogVisible = false;
    console.log($event);
    switch ($event) {
      case 'module':
        this.dataModuleDialogVisible = true;
        break;
      default:
        break;
    }
  }
  dataModuleDialogClose($event) {
    console.log($event);
    this.dataModuleDialogVisible = false;
    this.router.navigate(['/designer/report/reportDesigner', 'new']);
  }
  dataExternalDialogClose($event) {
    console.log($event);
    this.dataExternalDialogVisible = false;
  }
  goDetail(event, id) {
    event.stopPropagation();
    this.router.navigate(['/designer/report/reportDesignerView', id]);
  }
  goEdit(event, id) {
    event.stopPropagation();
    this.router.navigate(['/designer/report/reportDesigner', id]);
  }
}
