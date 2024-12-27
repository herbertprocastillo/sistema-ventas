import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WarehouseComponent} from './components/warehouse/warehouse.component';
import {Page404Component} from '../../shared/components/page404/page404.component';
import {MovementsComponent} from './components/movements/movements.component';
import {InventoryComponent} from './components/inventory/inventory.component';

const routes: Routes = [
  {
    path: '', component: InventoryComponent
  },
  {
    path: 'movements', component: MovementsComponent
  },
  {
    path: '**', component: Page404Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WarehouseRoutingModule {
}
