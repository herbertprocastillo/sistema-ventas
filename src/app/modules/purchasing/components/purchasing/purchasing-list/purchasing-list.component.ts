import {Component, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {PurchasingService} from '../../../services/purchasing.service';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {PurchaseOrder, Supplier} from '../../../interfaces/purchase-order';
import {RouterLink} from '@angular/router';
import {PurchasingExportComponent} from '../purchasing-export/purchasing-export.component';
import {UserService} from '../../../../users/services/user.service';
import {User as AppUser} from '../../../../users/interfaces/user';
import {map, startWith} from 'rxjs/operators';
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AsyncPipe, DatePipe, NgForOf, NgStyle, SlicePipe} from '@angular/common';
import {NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {Timestamp} from '@angular/fire/firestore';

@Component({
  selector: 'app-purchasing-list',
  standalone: true,
  imports: [
    RouterLink,
    PurchasingExportComponent,
    ReactiveFormsModule,
    FormsModule,
    AsyncPipe,
    DatePipe,
    NgbPagination,
    SlicePipe,
    NgForOf,
    NgStyle,
  ],
  templateUrl: './purchasing-list.component.html',
  styleUrl: './purchasing-list.component.scss'
})
export class PurchasingListComponent implements OnInit {
  /** IO **/
  @Output() template = new EventEmitter<string>();
  @Output() selectedOrder = new EventEmitter<PurchaseOrder>();

  /** INJECTS **/
  private usersService = inject(UserService);
  private purchasingService = inject(PurchasingService);

  /** COLLECTIONS **/
  public listUsers$: Observable<AppUser[]> = this.usersService.getUsers();
  public listSuppliers$: Observable<Supplier[]> = this.purchasingService.getSuppliers();
  public listOrders$: Observable<PurchaseOrder[]> = this.purchasingService.getAllOrders();
  public filteredOrders$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  /** VARIABLES **/
  public page: number = 1;
  public pageSize: number = 10;
  public statusControl = new FormControl("TODAS");
  public selectedDate: string | null = null;
  private selectedDate$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  ngOnInit(): void {
    /* Observe changes in the date field */
    this.selectedDate$.next(this.selectedDate);
    /* Filter the purchase orders collection with the data of suppliers, users, date and status of the order */
    combineLatest([
      this.listOrders$,
      this.listSuppliers$,
      this.listUsers$,
      this.statusControl.valueChanges.pipe(startWith('TODAS')),
      this.selectedDate$
    ]).pipe(
      map(([orders, suppliers, users, selectedStatus, selectedDate]) => {
        const mappedOrders = orders.map(order => {
          const supplier = suppliers.find((supplier) => supplier.id === order.supplier_id);
          const createdBy = users.find(user => user.id === order.createdBy);
          const updatedBy = users.find(user => user.id === order.updatedBy);
          return {
            ...order,
            supplier_name: supplier ? supplier.fullName : '--',
            supplier_phone: supplier ? supplier.phone : '--',
            supplier_company: supplier ? supplier.company : '--',
            supplier_ruc: supplier ? supplier.ruc : '--',
            supplier_dni: supplier ? supplier.dni : '--',
            created_by_name: createdBy ? createdBy.displayName : '--',
            updated_by_name: updatedBy ? updatedBy.displayName : '--',
          };
        });
        return mappedOrders.filter(order =>
          this.matchesStatus(order.status, selectedStatus) &&
          this.matchesDate(order.createdAt, selectedDate)
        );
      })
    ).subscribe((filterData) => {
      this.filteredOrders$.next(filterData);
    });
  }

  /** CAPTURE THE DATE FROM THE INPUT DATE **/
  onDateChange(event: any): void {
    this.selectedDate = event.target.value;
    this.selectedDate$.next(this.selectedDate); /* Issue the change */
  }

  /** FILTER STATUS PURCHASE ORDERS **/
  private matchesStatus(status: string, selectedStatus: string | null): boolean {
    return !selectedStatus || selectedStatus === 'TODAS' || status === selectedStatus;
  }

  /** FILTER DATE PURCHASE ORDERS **/
  private matchesDate(orderDate: Timestamp, selectedDate: string | null): boolean {
    if (!selectedDate) {
      return true; /* If a date is not selected, the filter is not applied */
    }

    /* Convert the selected date to a range of start and end of day */
    const selectedDateStart = Timestamp.fromDate(
      new Date(`${selectedDate}T00:00:00`)
    );

    const selectedDateEnd = Timestamp.fromDate(
      new Date(`${selectedDate}T23:59:59.999`)
    );

    /* Compare if order date is within range */
    return (
      orderDate.toMillis() >= selectedDateStart.toMillis() &&
      orderDate.toMillis() <= selectedDateEnd.toMillis()
    );
  }

  getTemplate(template: string) {
    this.template.emit(template);
  }

  getOrder(order: PurchaseOrder) {
    this.selectedOrder.emit(order);
  }
}
