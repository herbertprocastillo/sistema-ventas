import {Component, Input} from '@angular/core';
import * as XLSX from 'xlsx';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-movements-export',
  standalone: true,
  imports: [],
  templateUrl: './movements-export.component.html',
  styleUrl: './movements-export.component.scss'
})
export class MovementsExportComponent {
  @Input() filteredData: any[] = [];

  exportToExcel(): void {
    const formattedData = this.filteredData.map((item) => ({
      "TIPO DE MOVIMIENTO": item.type || 'No definido',
      "PRODUCTO": item.product_name || 'Producto',
      "CANTIDAD": item.quantity || 0,
      "PRECIO COSTO": item.price || 0,
      "REGISTRO POR": item.createdBy || 'Usuario',
      "FECHA DE REGISTRO": item.createdAt.toDate(),
      "ACTUALIZADO POR": item.updatedBy || 'Usuario',
      "FECHA DE ACTUALIZACION": item.updatedAt.toDate(),
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Movimientos');

    const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
    this.saveAsExcelFile(excelBuffer, 'Movimientos');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });
    saveAs(data, `${fileName}_${new Date().toLocaleDateString()}.xlsx`);
  }
}
