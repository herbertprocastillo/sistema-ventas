import {Component, inject} from '@angular/core';
import {CustomersService} from '../../services/customers.service';
import {ToastService} from '../../../../shared/toast/services/toast.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
@Component({
  selector: 'app-customers-new',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './customers-new.component.html',
  styleUrl: './customers-new.component.scss'
})
export class CustomersNewComponent {
  /** INJECT **/
  private customersService = inject(CustomersService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  /** VARIABLES **/
  public newForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required]],
    dni: ['', [Validators.required]],
    phone: ['', [Validators.required]],
  });

  async onSubmit(): Promise<void> {
    if (this.newForm.valid) {
      const newCustomer = this.newForm.value;
      try {
        await this.customersService.addCustomer(newCustomer);
        this.newForm.reset();
        this.toastService.showSuccess("EXITO! Cliente registrado correctamente.");

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
