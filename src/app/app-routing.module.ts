import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { ReportHomeComponent } from './views/report/report-home/report-home.component';

const routes: Routes = [
  { path: '', redirectTo: '/designer/report/reportList', pathMatch: 'full'},
  { path: 'login', component: LoginComponent},
  {
    path: 'designer',
    component: ReportHomeComponent,
    children: [{
      path: 'report',
      loadChildren: () => import(`./views/report/report.module`)
        .then(m => m.ReportModule)
    }]
  }
 ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
