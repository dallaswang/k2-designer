import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../shared/share.module';
import { ChartComponent } from './chart/chart.component';
import { WidgetChartComponent } from './chart/widget-chart.component';


@NgModule({
  declarations: [
    ChartComponent,
    WidgetChartComponent,
  ],
  imports: [
    CommonModule,
    ShareModule,
  ],
  exports: [
    CommonModule,
    ChartComponent,
    WidgetChartComponent,
  ]
})
export class CoreModule { }
