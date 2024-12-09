import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {Customer} from '../../interfaces/customer';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ToastService} from '../../../../shared/toast/services/toast.service';
import {CustomersService} from '../../services/customers.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-customers-edit',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './customers-edit.component.html',
  styleUrl: './customers-edit.component.scss'
})
export class CustomersEditComponent implements OnInit {
  /** IO **/
  @Input() customer: Customer | null = null;
  @Output() editCancel = new EventEmitter<boolean>();

  /** INJECTS **/
  private fb = inject(FormBuilder);
  private customersService = inject(CustomersService);
  private toastService = inject(ToastService);

  /** VARIABLES **/
  public editForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required]],
    dni: ['', [Validators.required]],
    phone: ['', [Validators.required]],
  })

  ngOnInit(): void {
    if (this.customer) {
      this.editForm.patchValue(this.customer);
    }
  }

  getCancel(value: boolean): void {
    this.editCancel.emit(value);
  }

  async onSubmit(): Promise<void> {
    if (this.editForm.valid && this.customer) {
      const customer = {...this.customer, ...this.editForm.value};

      try {
        await this.customersService.updateCustomer(customer.id, customer);
        this.toastService.showSuccess("EXITO! Cliente actualizado correctamente.");
        this.editForm.reset();
        this.getCancel(true);

      } catch (e) {
        this.toastService.showError(`${e}`);
        console.error(e);
      }
    } else {
      this.toastService.showError("POR FAVOR! verifica los datos del formulario.");
      return;
    }
  }
}
