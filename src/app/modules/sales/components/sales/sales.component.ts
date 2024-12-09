import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {SalesNavbarComponent} from '../sales-navbar/sales-navbar.component';
import {NgbModal, NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {ToastService} from '../../../../shared/toast/services/toast.service';
import {SalesService} from '../../services/sales.service';
import {Sale} from '../../interfaces/sale';
import {CurrencyPipe, DatePipe, DecimalPipe, NgForOf, NgIf, SlicePipe} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {UsersByIdComponent} from '../../../users/components/users-by-id/users-by-id.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {SalesFilterPipe} from '../../pipes/sales-filter.pipe';
import {User as AppUser} from '../../../users/interfaces/user';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [
    SalesNavbarComponent,
    SlicePipe,
    NgbPagination,
    RouterLink,
    DecimalPipe,
    CurrencyPipe,
    NgIf,
    UsersByIdComponent,
    DatePipe,
    ReactiveFormsModule,
    FormsModule,
    NgForOf,
    SalesFilterPipe,
  ],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.scss'
})
export class SalesComponent implements OnInit, OnDestroy {
  /** INJECTS **/
  private salesService = inject(SalesService);
  private modalService = inject(NgbModal);
  private toastService = inject(ToastService);
  private router = inject(Router);
  /** COLLECTIONS **/
  public sales: Sale[] = [];
  public users: AppUser[] = [];
  /** VARIABLES **/
  public page: number = 1;
  public pageSize: number = 10;
  public paymentMethod: string = "";
  public selectedDate: Date | null = null;
  private destroy$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.salesService.getSales()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => {
          this.sales = data;
        },
        error: e => {
          console.log(e);
        }
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getCleanFilters() {
    this.paymentMethod = "";
    this.selectedDate = null;
  }

  async getRoute(route: string) {
    await this.router.navigate([route]);
  }

  openDetailSaleModal(content: any, sale: Sale): void {
    if (!sale) {
      this.toastService.showError("No se encontro información sobre el detalle de la venta.");
      return;
    }
    try {
      this.modalService.open(content, {backdrop: 'static'});
    } catch (e) {
      console.error(`ERROR! Modal cerrado sin confirmacion. ${e}`);
    }
  }

  async openDetailPaymentModal(content: any, sale: Sale): Promise<void> {
    if (!sale) {
      this.toastService.showError("No se encontro información sobre la venta.");
      return;
    }
    try {
      this.modalService.open(content, {backdrop: 'static'});
    } catch (e) {
      console.error(`ERROR! Modal cerrado sin confirmacion. ${e}`);
    }
  }
}
