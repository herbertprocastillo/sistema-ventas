import {Component, EventEmitter, inject, OnDestroy, OnInit, Output} from '@angular/core';
import {Movement} from '../../interfaces/warehouse';
import {AsyncPipe, CurrencyPipe, DatePipe, NgStyle, SlicePipe} from '@angular/common';
import {NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {ProductInfoComponent} from '../../../../shared/components/product-info/product-info.component';
import {MovementsService} from '../../services/movements.service';
import {Subscription} from 'rxjs';
import {UsersByIdComponent} from '../../../users/components/users-by-id/users-by-id.component';

@Component({
  selector: 'app-warehouse-movements-list',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    NgbPagination,
    SlicePipe,
    CurrencyPipe,
    ProductInfoComponent,
    NgStyle,
    UsersByIdComponent
  ],
  templateUrl: './warehouse-movements-list.component.html',
  styleUrl: './warehouse-movements-list.component.scss'
})
export class WarehouseMovementsListComponent implements OnInit, OnDestroy {
  /** I/O **/
  @Output() movementEdit = new EventEmitter<Movement>();
  /** INJECTS **/
  private movementsService: MovementsService = inject(MovementsService);
  /** COLLECTIONS **/
  public movements: Movement[] = [];
  private subscription: Subscription | null = null;

  /** VARIABLES **/
  public page: number = 1;
  public pageSize: number = 10;

  ngOnInit(): void {
    this.movementsService.getMovements().subscribe(
      (movement: Movement[]) => {
        this.movements = movement;
      }
    )
  }

  getEdit(movement: Movement): void {
    this.movementEdit.emit(movement);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
