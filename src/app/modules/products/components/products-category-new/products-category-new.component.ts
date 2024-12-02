import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CategoriesService} from '../../services/categories.service';
import {ToastService} from '../../../../shared/toast/services/toast.service';

@Component({
  selector: 'app-products-category-new',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './products-category-new.component.html',
  styleUrl: './products-category-new.component.scss'
})
export class ProductsCategoryNewComponent {
  /** INJECTS **/
  private categoriesService = inject(CategoriesService);
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
      const category = this.newForm.value;

      try {
        await this.categoriesService.addCategory(category);
        this.toastService.showSuccess('Categoria registrada con EXITO!');
        this.newForm.reset();

      } catch (e) {
        this.toastService.showError(`${e}`);
        console.error(e);
      }
    } else {
      this.toastService.showError("POR FAVOR! completa todos los campos del formulario.");
      return;
    }
  }
}
