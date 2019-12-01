import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NvD3Module } from 'ng2-nvd3';
import { HttpClientModule } from '@angular/common/http';
import {DndModule} from 'ng2-dnd';
import {FilterCharPipe} from '../pipes/char.pipe';

@NgModule({
  declarations: [FilterCharPipe],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgZorroAntdModule,
    NvD3Module,
    DndModule,
    NzRadioModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgZorroAntdModule,
    NvD3Module,
    DndModule,
    NzRadioModule,
    FilterCharPipe,
  ]
})
export class ShareModule { }
