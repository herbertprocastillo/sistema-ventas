import {Component, EventEmitter, inject, OnDestroy, OnInit, Output} from '@angular/core';
import {Customer} from '../../interfaces/customer';
import {CustomersService} from '../../services/customers.service';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from '../../../../shared/toast/services/toast.service';
import {Subject, takeUntil} from 'rxjs';
import {DatePipe, SlicePipe} from '@angular/common';
import {UsersByIdComponent} from '../../../users/components/users-by-id/users-by-id.component';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [DatePipe, NgbPagination, SlicePipe, UsersByIdComponent, FormsModule],
  templateUrl: './customers-list.component.html',
  styleUrl: './customers-list.component.scss'
})
export class CustomersListComponent implements OnInit, OnDestroy {
  /** IO **/
  @Output() customer = new EventEmitter<Customer>();

  /** INJECT **/
  private customersService = inject(CustomersService);
  private modalService = inject(NgbModal);
  private toastService = inject(ToastService);

  /** COLLECTION **/
  listCustomers: Customer[] = [];

  /** VARIABLES **/
  page: number = 1;
  pageSize: number = 10;
  searchTerm: string = '';

  /** SUBSCRIPTION **/
  private destroy$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.customersService.getCustomers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: Customer[]) => {
          this.listCustomers = data;
        },
        error: (e) => console.log("ERROR: ", e)
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getEditCustomer(customer: Customer): void {
    this.customer.emit(customer);
  }

  filteredCustomers(): Customer[] {
    const searchTerm: string = this.searchTerm.trim().toLowerCase();
    return this.listCustomers.filter((customer: Customer) =>
      customer.fullName.toLowerCase().includes(searchTerm) ||
      customer.dni.toLowerCase().includes(searchTerm)
    );
  }

  async openDeleteModal(content: any, customerId: string | undefined): Promise<void> {
    if (!customerId) {
      this.toastService.showError('El ID del cliente no es válido.');
      return;
    }
    try {
      const modalRef = this.modalService.open(content, {backdrop: 'static'});
      const result = await modalRef.result;
      if (result === 'confirm') {
        await this.deleteCustomer(customerId);
      }
    } catch (error) {
      console.log('Modal cerrado sin confirmación', error);
    }
  }

  async deleteCustomer(customerId: string): Promise<void> {
    try {
      await this.customersService.deleteCustomer(customerId);
      this.toastService.showSuccess('EXITO! Cliente eliminado correctamente.');
    } catch (e) {
      this.toastService.showError(`ERROR! al eliminar el cliente. ${e}`);
    }
  }

}
