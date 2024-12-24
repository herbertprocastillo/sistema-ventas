import {Component, Input} from '@angular/core';
import * as XLSX from 'xlsx';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-inventory-export',
  standalone: true,
  imports: [],
  templateUrl: './inventory-export.component.html',
  styleUrl: './inventory-export.component.scss'
})
export class InventoryExportComponent {
  @Input() filteredData: any[] = [];

  exportToExcel(): void {
    const formattedData = this.filteredData.map((item) => ({
      "CATEGORIA": item.category_name || 'Sin categoría',
      "PRODUCTO": item.product_name || 'Sin nombre',
      "DESCRIPCION": item.product_description || 'Sin descripción',
      "STOCK": item.stock || 0,
      "PRECIO VENTA": item.price_sale || 0,
      "PRECIO COMPRA": item.price_cost || 0,
      "ULTIMA ACTUALIZACION": item.updatedAt.toDate(),
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventarios');

    const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
    this.saveAsExcelFile(excelBuffer, 'Inventarios');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });
    saveAs(data, `${fileName}_${new Date().toLocaleDateString()}.xlsx`);
  }
}
