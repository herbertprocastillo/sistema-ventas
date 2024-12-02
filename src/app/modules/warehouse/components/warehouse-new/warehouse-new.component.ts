import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {WarehouseService} from '../../services/warehouse.service';
import {ToastService} from '../../../../shared/toast/services/toast.service';

@Component({
  selector: 'app-warehouse-new',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './warehouse-new.component.html',
  styleUrl: './warehouse-new.component.scss'
})
export class WarehouseNewComponent {
  /** INJECTS **/
  private warehouseService = inject(WarehouseService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);
  /** VARIABLES **/
  public newForm: FormGroup;

  constructor() {
    this.newForm = this.fb.group({
      name: ['', [Validators.required]],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.newForm.valid) {
      const warehouseData = this.newForm.value;
      warehouseData.name = this.newForm.value.name.toUpperCase();

      try {
        await this.warehouseService.addWarehouse(warehouseData);
        this.toastService.showSuccess("Almacen registrado con EXITO!");
        this.newForm.reset();

      } catch (e) {
        this.toastService.showError(`ERROR! al registrar el almacen, ${e}`);
      }
    } else {
      this.toastService.showError("POR FAVOR! completa todos los campos del formulario.");
      return;
    }
  }
}
