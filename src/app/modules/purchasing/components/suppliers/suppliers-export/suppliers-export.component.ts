import {Component, Input} from '@angular/core';
import * as XLSX from 'xlsx';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-suppliers-export',
  standalone: true,
  imports: [],
  templateUrl: './suppliers-export.component.html',
  styleUrl: './suppliers-export.component.scss'
})
export class SuppliersExportComponent {
  @Input() filteredData: any[] = [];

  exportToExcel(): void {
    const formattedData = this.filteredData.map((item) => ({
      "EMPRESA": item.company || '',
      "RUC": item.ruc || '',
      "REPRESENTANTE": item.fullName || '',
      "DNI": item.dni || '',
      "CORREO ELECTRONICO": item.email || '',
      "TELEFONO": item.phone || '',
      "DIRECCION": item.address || '',
      "USUARIO REGISTRO": item.created_by_name || '',
      "FECHA REGISTRO": item.createdAt.toDate(),
      "USUARIO ACTUALIZACION": item.updated_by_name || '',
      "FECHA ACTUALIZACION": item.updatedAt.toDate(),
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Proveedores');

    const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
    this.saveAsExcelFile(excelBuffer, 'Proveedores');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });
    saveAs(data, `${fileName}_${new Date().toLocaleDateString()}.xlsx`);
  }
}
