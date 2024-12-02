import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Warehouse} from '../../interfaces/warehouse';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {WarehouseService} from '../../services/warehouse.service';
import {ToastService} from '../../../../shared/toast/services/toast.service';

@Component({
  selector: 'app-warehouse-edit',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './warehouse-edit.component.html',
  styleUrl: './warehouse-edit.component.scss'
})
export class WarehouseEditComponent implements OnInit {
  @Input() warehouse: Warehouse | null = null;
  @Output() editCancel = new EventEmitter<boolean>();
  public editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private warehouseService: WarehouseService,
    private toastService: ToastService) {

    this.editForm = this.fb.group({
      name: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.warehouse) {
      this.editForm.patchValue(this.warehouse);
    }
  }

  async onSubmit() {
    if (this.editForm.valid && this.warehouse) {
      try {
        const warehouse = {...this.warehouse, ...this.editForm.value};
        await this.warehouseService.updateWarehouse(warehouse.id, warehouse);
        this.toastService.showSuccess("ALMACEN ACTUALIZADO CON EXITO");
        this.getCancel(true);

      } catch (error) {
        this.toastService.showError(`ERROR AL ACTUALIZAR EL ALMACEN", ${error}`);
        throw error;
      }
    }
  }

  getCancel(value: boolean) {
    this.editCancel.emit(value);
  }
}
