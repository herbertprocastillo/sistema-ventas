import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SalesRoutingModule} from './sales-routing.module';
import {GoogleChartsModule} from 'angular-google-charts';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SalesRoutingModule,
    GoogleChartsModule
  ]
})
export class SalesModule {
}
