import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WarehouseComponent} from './components/warehouse/warehouse.component';
import {Page404Component} from '../../shared/components/page404/page404.component';
import {WarehouseMovementsComponent} from './components/warehouse-movements/warehouse-movements.component';
import {WarehouseInventoryComponent} from './components/warehouse-inventory/warehouse-inventory.component';

const routes: Routes = [
  {
    path: '', component: WarehouseComponent
  },
  {
    path: 'movements', component: WarehouseMovementsComponent
  },
  {
    path: 'inventory', component: WarehouseInventoryComponent
  },
  {
    path: '**', component: Page404Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WarehouseRoutingModule {
}
