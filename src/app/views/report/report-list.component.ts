import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../services/httpRequest.service';
import { NzMessageService } from 'ng-zorro-antd/message';


@Component({
  selector: 'report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.less']
})
export class ReportListComponent implements OnInit {
  chooseDataDialogVisible: boolean = false;
  dataModuleDialogVisible: boolean = false;
  dataExternalDialogVisible: boolean = false;
  reportList: Array<any> = [];
  constructor( public router: Router, public httpService: HttpService,private nzMessageService: NzMessageService) { }

  ngOnInit() {
    this.getListData();
  }

  getListData() {
    this.httpService.post('/api/onedataservice/reportdesigner/list', {}).subscribe(result =>{
      this.reportList = result.Data;
      this.reportList.forEach(item =>{
        let designerData = JSON.parse(item.ReportDesignerData);
        item['reportTitle'] = designerData.reportData.reportTitle;
      })
    });
  }

  chooseDataClose($event) {
    this.chooseDataDialogVisible = false;
    switch ($event) {
      case 'module':
        this.dataModuleDialogVisible = true;
        break;
      default:
        break;
    }
  }

  dataModuleDialogClose($event) {
    this.dataModuleDialogVisible = false;
    if ($event) {
      this.router.navigate(['/designer/report/reportDesigner', 'new']);
    }
  }

  dataExternalDialogClose($event) {
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

  deleteCard(index, id) {
    this.httpService.get('/api/onedataservice/reportdesigner/delete', {id: id}).subscribe(result => {
      this.reportList.splice(index,1);
    })
  }
}
