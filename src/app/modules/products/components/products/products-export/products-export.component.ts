import {Component, Input} from '@angular/core';
import * as XLSX from 'xlsx';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-products-export',
  standalone: true,
  imports: [],
  templateUrl: './products-export.component.html',
  styleUrl: './products-export.component.scss'
})
export class ProductsExportComponent {
  @Input() filteredData: any[] = [];

  exportToExcel(): void {
    const formattedData = this.filteredData.map((item) => ({
      "CATEGORIA": item.category_name || 'Sin categoría',
      "PRODUCTO": item.name || 'Sin nombre',
      "DESCRIPCION": item.description || 'Sin descripción',
      "REGISTRO POR": item.created_by_name || 'Sin usuario',
      "FECHA DE REGISTRO": item.createdAt.toDate(),
      "ACTUALIZADO POR": item.updated_by_name || 'Sin usuario',
      "FECHA DE ACTUALIZACION": item.updatedAt.toDate(),
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');

    const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
    this.saveAsExcelFile(excelBuffer, 'Productos');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });
    saveAs(data, `${fileName}_${new Date().toLocaleDateString()}.xlsx`);
  }
}
