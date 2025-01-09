import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PurchasingComponent} from './components/purchasing/purchasing.component';
import {Page404Component} from '../../shared/components/page404/page404.component';
import {SuppliersComponent} from './components/suppliers/suppliers.component';

const routes: Routes = [
  {
    path: '', component: PurchasingComponent
  },
  {
    path: 'suppliers', component: SuppliersComponent
  },
  {
    path: '**', component: Page404Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchasingRoutingModule {
}
