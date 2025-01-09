import {Component, inject, OnInit} from '@angular/core';
import {PurchasingNavbarComponent} from '../purchasing/purchasing-navbar/purchasing-navbar.component';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {SuppliersExportComponent} from './suppliers-export/suppliers-export.component';
import {UserService} from '../../../users/services/user.service';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from '../../../../shared/toast/services/toast.service';
import {PurchasingService} from '../../services/purchasing.service';
import {Supplier} from '../../interfaces/purchase-order';
import {BehaviorSubject, combineLatest, Observable, startWith} from 'rxjs';
import {User as AppUser} from '../../../users/interfaces/user';
import {map} from 'rxjs/operators';
import {SuppliersEditComponent} from './suppliers-edit/suppliers-edit.component';
import {SuppliersNewComponent} from './suppliers-new/suppliers-new.component';
import {AsyncPipe, DatePipe, NgForOf, SlicePipe} from '@angular/common';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [
    PurchasingNavbarComponent,
    ReactiveFormsModule,
    RouterLink,
    SuppliersExportComponent,
    SuppliersEditComponent,
    SuppliersNewComponent,
    AsyncPipe,
    DatePipe,
    NgbPagination,
    SlicePipe,
    NgForOf,
  ],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.scss'
})
export class SuppliersComponent implements OnInit {
  /** INJECTS **/
  private usersService = inject(UserService);
  private purchasingService = inject(PurchasingService);
  private modalService = inject(NgbModal);
  private toastService = inject(ToastService);

  /** VARIABLES **/
  public page: number = 1;
  public pageSize: number = 10;
  public searchControl = new FormControl();
  public editSupplier: Supplier | null = null;

  /** COLLECTIONS **/
  public listUsers$: Observable<AppUser[]> = this.usersService.getUsers();
  public listSuppliers$: Observable<Supplier[]> = this.purchasingService.getSuppliers();
  public filteredSuppliers$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  ngOnInit(): void {
    combineLatest([
      this.listSuppliers$,
      this.listUsers$,
      this.searchControl.valueChanges.pipe(startWith('')),
    ]).pipe(
      map(([suppliers, users, searchTerm]) => {
        const mappedSuppliers = suppliers.map(supplier => {
          const createdBy = users.find(user => user.id === supplier.createdBy);
          const updatedBy = users.find(user => user.id === supplier.updatedBy);
          return {
            ...supplier,
            created_by_name: createdBy ? createdBy.displayName : '--',
            updated_by_name: updatedBy ? updatedBy.displayName : '--',
          };
        });
        return mappedSuppliers.filter(supplier =>
          this.matchesSearch(supplier, searchTerm));
      })
    ).subscribe((filterData) => {
      this.filteredSuppliers$.next(filterData);
    });
  }

  /** FILTER PRODUCTS FROM PRODUCTS **/
  private matchesSearch(supplier: Supplier, searchTerm: string): boolean {
    const term: string = searchTerm?.trim().toLowerCase() || '';
    return (
      (supplier.fullName?.includes(term) || false) ||
      (supplier.dni?.includes(term) || false) ||
      (supplier.company?.includes(term) || false) ||
      (supplier.ruc?.includes(term) || false)
    );
  }

  getEditSupplier(supplier: Supplier) {
    this.editSupplier = supplier;
  }

  getCancel(cancel: boolean): void {
    if (cancel) {
      this.editSupplier = null;
    }
  }

  /** OPEN MODAL DELETE **/
  async openDeleteModal(content: any, supplierId: string | undefined): Promise<void> {
    if (!supplierId) {
      this.toastService.showError('El ID del proveedor no es válido.');
      return;
    }
    try {
      const modalRef = this.modalService.open(content, {backdrop: 'static'});
      const result = await modalRef.result;
      if (result === 'confirm') {
        await this.deleteSupplier(supplierId);
      }
    } catch (error) {
      console.log('Modal cerrado sin confirmación', error);
    }
  }

  /** DELETE PRODUCT **/
  async deleteSupplier(supplierId: string): Promise<void> {
    try {
      await this.purchasingService.deleteSupplier(supplierId);
      this.toastService.showSuccess('Proveedor eliminado con éxito');
    } catch (error) {
      this.toastService.showError(`Error al eliminar el proveedor: ${error}`);
    }
  }
}
