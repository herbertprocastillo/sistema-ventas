import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SigninComponent} from './components/signin/signin.component';
import {SignupComponent} from './components/signup/signup.component';
import {Page404Component} from '../../shared/components/page404/page404.component';

const routes: Routes = [
  {
    path: '', component: SigninComponent
  },
  {
    path: 'signup', component: SignupComponent
  },
  {
    path: '**', component: Page404Component
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}
