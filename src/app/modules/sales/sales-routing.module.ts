import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SalesComponent} from './components/sales/sales.component';
import {Page404Component} from '../../shared/components/page404/page404.component';
import {SalesReportsComponent} from './components/sales-reports/sales-reports.component';

const routes: Routes = [
  {
    path: '', component: SalesComponent
  },
  {
    path: 'reports', component: SalesReportsComponent
  },
  {
    path: '**', component: Page404Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule {
}
