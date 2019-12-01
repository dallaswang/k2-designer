import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthenticationModule, CustomConfig } from './services/auth/index';
import { ServiceConfig } from './services/service.config';
import { ServiceModule } from './services/service.module';
import { ENV } from '../environments/environment';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ShareModule } from './shared/share.module';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { IconDefinition } from '@ant-design/icons-angular';
import { NzIconModule, NZ_ICONS } from 'ng-zorro-antd/icon';
import {DndModule} from 'ng2-dnd';

import { HeaderComponent } from './views/header/header.component';
import { SidebarComponent } from './views/sidebar/sidebar.component';

import { LoginComponent } from './views/login/login.component';
import { ReportHomeComponent } from './views/report/report-home/report-home.component';
const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};

const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => {
  const i = antDesignIcons[key];
  return i;
});

export class AppServiceConfig extends ServiceConfig {
  baseUrl = ENV.apiUri;
}

export class AuthConfig extends CustomConfig {
  baseUrl = ENV.authUri;
  loginUrl = '/connect/token';
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    LoginComponent,
    ReportHomeComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ShareModule,
    NzIconModule,
    AuthenticationModule.forRoot(AuthConfig),
    ServiceModule.forRoot(AppServiceConfig),
    DndModule.forRoot(),
  ],
  providers: [
   {
    provide: NZ_ICONS,
    useValue: icons
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
