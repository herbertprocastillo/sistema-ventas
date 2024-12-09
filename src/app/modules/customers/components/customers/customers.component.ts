import {Component} from '@angular/core';
import {CustomersNavbarComponent} from '../customers-navbar/customers-navbar.component';
import {RouterLink} from '@angular/router';
import {CustomersEditComponent} from '../customers-edit/customers-edit.component';
import {CustomersNewComponent} from '../customers-new/customers-new.component';
import {CustomersListComponent} from '../customers-list/customers-list.component';
import {Customer} from '../../interfaces/customer';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CustomersNavbarComponent,
    RouterLink,
    CustomersEditComponent,
    CustomersNewComponent,
    CustomersListComponent,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent {
  /** VARIABLES **/
  public editCustomer: Customer | null = null;

  getEditCustomer(customer: Customer) {
    this.editCustomer = customer;
  }

  getCancel(cancel: boolean) {
    if (cancel) {
      this.editCustomer = null;
    }
  }
}
