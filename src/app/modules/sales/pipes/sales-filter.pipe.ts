import {Pipe, PipeTransform} from '@angular/core';
import {Sale} from '../interfaces/sale';
import {Timestamp} from '@angular/fire/firestore';

@Pipe({
  name: 'salesFilter',
  pure: false,
  standalone: true
})
export class SalesFilterPipe implements PipeTransform {
  transform(sales: Sale[], paymentMethod: string, selectedDate: Date | null): Sale[] {
    if (!sales) {
      return [];
    }

    let filteredSales: Sale[] = sales;

    /** Filter by payment method **/
    if (paymentMethod) {
      filteredSales = filteredSales.filter(
        (sale: Sale) => sale.paymentMethod === paymentMethod);
    }

    /** Filter by createdAt **/
    if (selectedDate) {
      const selectedDateString: string = new Date(selectedDate)
        .toISOString().split('T')[0];

      filteredSales = filteredSales.filter((sale: Sale) => {
        const saleDate: Date = (sale.createdAt as Timestamp).toDate();
        const saleDateString: string = saleDate.toISOString().split('T')[0];
        return saleDateString === selectedDateString;
      });
    }

    return filteredSales;
  }
}
