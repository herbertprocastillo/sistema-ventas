import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ToastService} from '../../../../../shared/toast/services/toast.service';
import {PurchasingService} from '../../../services/purchasing.service';
import {Supplier} from '../../../interfaces/purchase-order';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-suppliers-new',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './suppliers-new.component.html',
  styleUrl: './suppliers-new.component.scss'
})
export class SuppliersNewComponent {
  /** INJECTS **/
  private purchasingService = inject(PurchasingService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  /** FORMS **/
  public newForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required]],
    dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
    phone: ['', [Validators.required,Validators.pattern('^[0-9]{9}$')]],
    email: ['', [Validators.email]],
    company: ['', [Validators.required]],
    ruc: ['', [Validators.required, Validators.pattern('^[0-9]{11}$')]],
    address: ['', [Validators.required]]
  });

  async onSubmit(): Promise<void> {
    if (this.newForm.valid) {
      const newSupplier: Supplier = this.newForm.value;
      try {
        await this.purchasingService.addSupplier(newSupplier);
        this.newForm.reset();
        this.toastService.showSuccess("EXITO! Proveedor registrado correctamente.");

      } catch (e) {
        this.toastService.showError(`${e}`);
        console.error(e);
      }
    } else {
      this.toastService.showError("ERROR! Por favor completa todos los campos del formulario.");
      return;
    }
  }

}
