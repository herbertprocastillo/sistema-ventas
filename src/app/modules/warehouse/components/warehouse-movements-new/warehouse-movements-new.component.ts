import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ToastService} from '../../../../shared/toast/services/toast.service';
import {WarehouseProductsPickerComponent} from '../warehouse-products-picker/warehouse-products-picker.component';
import {Product} from '../../../products/interfaces/product';
import {MovementsService} from '../../services/movements.service';

@Component({
  selector: 'app-warehouse-movements-new',
  standalone: true,
  imports: [ReactiveFormsModule, WarehouseProductsPickerComponent],
  templateUrl: './warehouse-movements-new.component.html',
  styleUrl: './warehouse-movements-new.component.scss'
})
export class WarehouseMovementsNewComponent {
  public newForm: FormGroup;


  @ViewChild(WarehouseProductsPickerComponent) productPicker!: WarehouseProductsPickerComponent;

  constructor(
    private fb: FormBuilder,
    private movementService: MovementsService,
    private toastService: ToastService) {

    this.newForm = this.fb.group({
      product: [''],
      quantity: [0, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      type: ['INGRESO', [Validators.required]],
    });
  }

  getSelectedProduct(product: Product): void {
    if (product) {
      this.newForm.patchValue({
        product: product.id
      });
    }
  }

  async onSubmit(): Promise<void> {
    const movementData = this.newForm.value;

    if (!movementData.product) {
      console.error("no se selecciono un producto valido");
      return;
    }

    console.log("datos del movimiento", movementData);


    if (this.newForm.invalid) {
      this.toastService.showError("Por favor complete todos los campos del formulario")
    } else {
      const movementData = {
        ...this.newForm.value,
      }
      try {
        await this.movementService.addMovement(movementData);
        this.toastService.showSuccess("MOVIMIENTO DE ALMACEN REGISTRADO CON EXITO");
        this.newForm.reset();
        this.newForm.patchValue({product: ''});

        if (this.productPicker) {
          this.productPicker.resetPicker();
        }

      } catch (error) {
        this.toastService.showError(`ERROR AL REGISTRAR EL MOVIMIENTO DE ALMACEN, ${error}`);
      }
    }
  }
}
