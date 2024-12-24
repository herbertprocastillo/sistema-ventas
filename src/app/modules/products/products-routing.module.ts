import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProductsComponent} from './components/products/products.component';
import {Page404Component} from '../../shared/components/page404/page404.component';
import {ProductsCategoryComponent} from './components/categories/products-category/products-category.component';

const routes: Routes = [
  {
    path: '', component: ProductsComponent
  },
  {
    path: 'categories', component: ProductsCategoryComponent
  },
  {
    path: '**', component: Page404Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule {
}
