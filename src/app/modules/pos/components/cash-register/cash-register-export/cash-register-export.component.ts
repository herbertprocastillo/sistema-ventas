import {Component, Input} from '@angular/core';
import * as XLSX from 'xlsx';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-cash-register-export',
  standalone: true,
  imports: [],
  templateUrl: './cash-register-export.component.html',
  styleUrl: './cash-register-export.component.scss'
})
export class CashRegisterExportComponent {
  @Input() filteredData: any[] = [];

  exportToExcel(): void {
    const formattedData = this.filteredData.map((item) => ({
      "Nº CAJA": item.number || '',
      "FECHA APERTURA": item.openDate.toDate() || '',
      "FECHA CIERRE": item.closeDate.toDate() || '',
      "VENDEDOR": item.seller_name || '',
      "MONTO APERTURA": item.openingAmount || '',
      "MONTO CIERRE": item.totalAmount || '',
      "ESTADO": item.status || '',
      "USUARIO REGISTRO": item.created_by_name || '',
      "FECHA REGISTRO": item.createdAt.toDate(),
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'CAJAS');

    const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
    this.saveAsExcelFile(excelBuffer, 'CAJAS');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });
    saveAs(data, `${fileName}_${new Date().toLocaleDateString()}.xlsx`);
  }
}
