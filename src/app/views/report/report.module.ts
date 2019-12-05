import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../shared/share.module';
import {CoreModule} from '../../components/core.module';

import { ReportListComponent } from './report-list.component';
import { ReportRouterModule } from './report-router.module';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { ReportDesignerViewComponent } from './report-designer-view.component';
import { ReportDesignerComponent } from './report-designer.component';
import { DataSourcesListComponent } from './dataSource/data-sources-list.component';
import { ReportUserComponent } from './user/report-user.component';
import { ChooseDataSourcesListComponent } from './dataSource/choose-data-sources-list.component';
import { DataSourcesExternalComponent } from './dataSource/data-sources-external.component';
import { DataSourcesModuleComponent } from './dataSource/data-sources-module.component';
import { FilterComponent } from './dialog/filter.component';
import { FilterColumnPipe } from './pipes/column.pipe';
import { ShowColumnsComponent } from './dialog/show-columns.component';
import { WhereComponent } from './dialog/where/where.component';
@NgModule({
  declarations: [
    ReportListComponent,
    ReportDesignerViewComponent,
    ReportDesignerComponent,
    DataSourcesListComponent,
    ReportUserComponent,
    ChooseDataSourcesListComponent,
    DataSourcesExternalComponent,
    DataSourcesModuleComponent,
    FilterComponent,
    ShowColumnsComponent,
    WhereComponent,
    FilterColumnPipe
  ],
  imports: [
    CommonModule,
    ShareModule,
    CoreModule,
    ReportRouterModule,
    MalihuScrollbarModule.forRoot(),
  ],
  exports: []
})
export class ReportModule { }
