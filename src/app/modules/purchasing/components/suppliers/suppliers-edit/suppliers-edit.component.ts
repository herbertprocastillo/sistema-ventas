import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {ToastService} from '../../../../../shared/toast/services/toast.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {PurchasingService} from '../../../services/purchasing.service';
import {Supplier} from '../../../interfaces/purchase-order';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-suppliers-edit',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './suppliers-edit.component.html',
  styleUrl: './suppliers-edit.component.scss'
})
export class SuppliersEditComponent implements OnInit {
  /** IO **/
  @Input() supplier: Supplier | null = null;
  @Output() editCancel = new EventEmitter<boolean>();

  /** INJECTS **/
  private purchasingService = inject(PurchasingService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  /** FORMS **/
  public editForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required]],
    dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
    email: ['', [Validators.email]],
    company: ['', [Validators.required]],
    ruc: ['', [Validators.required, Validators.pattern('^[0-9]{11}$')]],
    address: ['', [Validators.required]]
  });

  ngOnInit(): void {
    if (this.supplier) {
      this.editForm.patchValue(this.supplier);
    }
  }

  getCancel(value: boolean): void {
    this.editCancel.emit(value);
  }

  async onSubmit(): Promise<void> {
    if (this.editForm.valid && this.supplier) {
      const newSupplier = {...this.supplier, ...this.editForm.value};
      try {
        await this.purchasingService.updateSupplier(newSupplier.id, newSupplier);
        this.toastService.showSuccess("EXITO! Proveedor actualizado correctamente.");
        this.editForm.reset();
        this.getCancel(true);

      } catch (e) {
        this.toastService.showError(`ERROR! al actualizar el proveedor. ${e}`);
        console.error("ERROR! al actualizar el proveedor.", e);
      }
    } else {
      return;
    }
  }
}
