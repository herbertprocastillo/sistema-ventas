import {Component, inject} from '@angular/core';
import {ProductsService} from '../../../services/products.service';
import {ToastService} from '../../../../../shared/toast/services/toast.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-categories-new',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './categories-new.component.html',
  styleUrl: './categories-new.component.scss'
})
export class CategoriesNewComponent {
  /** INJECTS **/
  private productsService = inject(ProductsService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  /** FORM **/
  public newForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
  });

  async onSubmit(): Promise<void> {
    if (this.newForm.valid) {
      const category = this.newForm.value;

      try {
        await this.productsService.addCategory(category);
        this.toastService.showSuccess('EXITO! Categoria registrada correctamente.');
        this.newForm.reset();

      } catch (e) {
        this.toastService.showError(`ERROR! al registrar la categoria: ${e}`);
        console.error(e);
      }
    } else {
      this.toastService.showError("POR FAVOR! completa todos los campos del formulario.");
      return;
    }
  }
}
