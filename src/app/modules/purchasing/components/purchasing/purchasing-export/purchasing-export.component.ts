import {Component, Input} from '@angular/core';
import * as XLSX from 'xlsx';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-purchasing-export',
  standalone: true,
  imports: [],
  templateUrl: './purchasing-export.component.html',
  styleUrl: './purchasing-export.component.scss'
})
export class PurchasingExportComponent {
  @Input() filteredData: any[] = [];

  exportToExcel(): void {
    const formattedData = this.filteredData.map((item) => ({
      "Nº ORDEN": item.orderNumber || '--',
      "FECHA COMPRA": item.createdAt.toDate(),
      "EMPRESA": item.supplier_company || '--',
      "RUC": item.supplier_ruc || "--",
      "REPRESENTANTE": item.supplier_name || "--",
      "DNI": item.supplier_dni || '--',
      "TELEFONO": item.supplier_phone || '--',
      "REGISTRADO POR": item.created_by_name || '--',
      "ACTUALIZADO POR": item.updated_by_name || '--',
      "FECHA DE ACTUALIZACION": item.updatedAt.toDate(),
      "OBSERVACIONES": item.comments || '--',
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'COMPRAS');

    const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
    this.saveAsExcelFile(excelBuffer, 'COMPRAS');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });
    saveAs(data, `${fileName}_${new Date().toLocaleDateString()}.xlsx`);
  }
}
