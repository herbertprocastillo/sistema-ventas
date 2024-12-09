import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {GoogleChartsModule} from 'angular-google-charts';
import {CommonModule} from '@angular/common';
import {SalesNavbarComponent} from '../sales-navbar/sales-navbar.component';
import {Sale} from '../../interfaces/sale';
import {SalesService} from '../../services/sales.service';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-sales-reports',
  standalone: true,
  imports: [
    [CommonModule],
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    GoogleChartsModule,
    SalesNavbarComponent,
  ],
  templateUrl: './sales-reports.component.html',
  styleUrl: './sales-reports.component.scss'
})
export class SalesReportsComponent implements OnInit, OnDestroy {
  /** INJECTS **/
  private salesService = inject(SalesService);

  /** COLLECTIONS **/
  public sales: Sale[] = [];
  chartData: any[] = [];
  chartOptions = {
    title: 'Ventas Diarias del Mes',
    hAxis: { title: 'Fecha', format: 'd MMM', slantedText: true },
    vAxis: { title: 'Total Ventas (S/.)' },
    legend: 'none',
    bar: { groupWidth: '75%' },
  };
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
}
