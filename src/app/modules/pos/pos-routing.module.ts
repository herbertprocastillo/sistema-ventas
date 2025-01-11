import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PosComponent} from './components/pos/pos.component';
import {Page404Component} from '../../shared/components/page404/page404.component';
import {CashRegisterComponent} from './components/cash-register/cash-register.component';

const routes: Routes = [
  {
    path: '', component: PosComponent
  },
  {
    path: 'cashRegister', component: CashRegisterComponent
  },
  {
    path: '**', component: Page404Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PosRoutingModule {
}
