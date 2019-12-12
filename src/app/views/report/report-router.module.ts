import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import { ReportListComponent } from './report-list.component';
import { ReportDesignerViewComponent } from './report-designer-view.component';
import { ReportDesignerComponent } from './report-designer.component';

const routes: Routes = [
  { path: 'reportList', component: ReportListComponent },
  { path: 'reportDesignerView/:id', component: ReportDesignerViewComponent },
  { path: 'reportDesigner/:id', component: ReportDesignerComponent },
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ReportRouterModule { }
