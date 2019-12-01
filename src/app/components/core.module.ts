import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../shared/share.module';
import { ChartComponent } from './chart/chart.component';


@NgModule({
  declarations: [
    ChartComponent
  ],
  imports: [
    CommonModule,
    ShareModule,
  ],
  exports: [
    CommonModule,
    ChartComponent
  ]
})
export class CoreModule { }
