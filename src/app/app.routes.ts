import {Routes} from '@angular/router';
import {HomeComponent} from './shared/components/home/home.component';
import {Page404Component} from './shared/components/page404/page404.component';
import {AuthGuard, canActivate, redirectLoggedInTo, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import {roleGuard} from './modules/auth/guards/role.guard';
import {UnauthorizedComponent} from './shared/components/unauthorized/unauthorized.component';


export const routes: Routes = [
  {
    ...canActivate(() => redirectUnauthorizedTo(['auth'])),
    path: 'home', component: HomeComponent,
  },
  {
    ...canActivate(() => redirectLoggedInTo(['home'])),
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule),
  },
  {
    ...canActivate(() => redirectUnauthorizedTo(['auth'])),
    path: 'pos',
    loadChildren: () => import('./modules/pos/pos.module').then(m => m.PosModule),
  },
  {
    ...canActivate(() => redirectUnauthorizedTo(['auth'])),

    path: 'sales',
    loadChildren: () => import('./modules/sales/sales.module').then(m => m.SalesModule),
  },
  {
    ...canActivate(() => redirectUnauthorizedTo(['auth'])),
    path: 'products',
    loadChildren: () => import('./modules/products/products.module').then(m => m.ProductsModule),
  },
  {
    ...canActivate(() => redirectUnauthorizedTo(['auth'])),
    path: 'purchasing',
    loadChildren: () => import('./modules/purchasing/purchasing.module').then(m => m.PurchasingModule),
  },
  {
    canActivate: [AuthGuard, roleGuard],
    data: {role: 'admin'},
    path: 'warehouse',
    loadChildren: () => import('./modules/warehouse/warehouse.module').then(m => m.WarehouseModule),
  },
  {
    ...canActivate(() => redirectUnauthorizedTo(['auth'])),
    path: 'customers',
    loadChildren: () => import('./modules/customers/customers.module').then(m => m.CustomersModule),
  },
  {
    path: 'users',
    loadChildren: () => import('./modules/users/users.module').then(m => m.UsersModule),
    canActivate: [AuthGuard, roleGuard],
    data: {role: 'admin'},
  },
  {
    path: '', redirectTo: '/home', pathMatch: 'full',
  },
  {
    path: '**', component: Page404Component
  },
  {
    path: 'unauthorized', component: UnauthorizedComponent
  },
];
