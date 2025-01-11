import {Component, inject, OnInit} from '@angular/core';
import {PosNavbarComponent} from '../pos/pos-navbar/pos-navbar.component';
import {AsyncPipe, DatePipe, NgForOf, SlicePipe} from '@angular/common';
import {NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {CashRegisterExportComponent} from './cash-register-export/cash-register-export.component';
import {CashRegisterEditComponent} from './cash-register-edit/cash-register-edit.component';
import {CashRegisterNewComponent} from './cash-register-new/cash-register-new.component';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {User as AppUser} from '../../../users/interfaces/user';
import {UserService} from '../../../users/services/user.service';
import {ToastService} from '../../../../shared/toast/services/toast.service';
import {PosService} from '../../services/pos.service';
import {CashRegister} from '../../interfaces/pos';
import {map} from 'rxjs/operators';
import {Supplier} from '../../../purchasing/interfaces/purchase-order';

@Component({
  selector: 'app-cash-register',
  standalone: true,
  imports: [
    PosNavbarComponent,
    AsyncPipe,
    DatePipe,
    NgForOf,
    NgbPagination,
    ReactiveFormsModule,
    SlicePipe,
    RouterLink,
    CashRegisterExportComponent,
    CashRegisterEditComponent,
    CashRegisterNewComponent
  ],
  templateUrl: './cash-register.component.html',
  styleUrl: './cash-register.component.scss'
})
export class CashRegisterComponent implements OnInit {
  /** INJECTS **/
  private usersService = inject(UserService);
  private posService = inject(PosService);
  private toastService = inject(ToastService);

  /** VARIABLES **/
  public page: number = 1;
  public pageSize: number = 10;
  public editCashRegister: CashRegister | null = null;

  /** COLLECTIONS **/
  public listUsers$: Observable<AppUser[]> = this.usersService.getUsers();
  public listCashRegisters$: Observable<CashRegister[]> = this.posService.getCashRegisters();
  public filteredCashRegisters$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  ngOnInit(): void {
    combineLatest([
      this.listCashRegisters$,
      this.listUsers$,
    ]).pipe(
      map(([cashRegisters, users]) => {
        return cashRegisters.map(cashRegister => {
          const seller = users.find(user => user.id === cashRegister.seller_id);
          const createdBy = users.find(user => user.id === cashRegister.createdBy);
          return {
            ...cashRegister,
            seller: seller ? seller.displayName : '--',
            created_by_name: createdBy ? createdBy.displayName : '--',
          };
        });
      })
    ).subscribe((filterData) => {
      this.filteredCashRegisters$.next(filterData);
    });
  }

  getEditCashRegister(cashRegister: CashRegister) {
    this.editCashRegister = cashRegister;
  }

  getCancel(cancel: boolean): void {
    if (cancel) {
      this.editCashRegister = null;
    }
  }

}
