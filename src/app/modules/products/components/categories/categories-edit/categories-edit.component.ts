import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {Category} from '../../../interfaces/product';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ProductsService} from '../../../services/products.service';
import {ToastService} from '../../../../../shared/toast/services/toast.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-categories-edit',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './categories-edit.component.html',
  styleUrl: './categories-edit.component.scss'
})
export class CategoriesEditComponent implements OnInit {
  /** IO **/
  @Input() category: Category | null = null;
  @Output() editCancel = new EventEmitter<boolean>();

  /** INJECTS **/
  private fb = inject(FormBuilder);
  private productsService = inject(ProductsService);
  private toastService = inject(ToastService);

  /** FORM **/
  public editForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
  });

  ngOnInit(): void {
    if (this.category) {
      this.editForm.patchValue(this.category);
    }
  }

  getCancel(value: boolean): void {
    this.editCancel.emit(value);
  }

  async onSubmit(): Promise<void> {
    if (this.editForm.valid && this.category) {
      const category = {...this.category, ...this.editForm.value};

      try {
        await this.productsService.updateCategory(category.id, category);
        this.toastService.showSuccess("EXITO! Categoria actualizada correctamente..");
        this.editForm.reset();
        this.getCancel(true);

      } catch (e) {
        this.toastService.showError(`ERROR! al editar la categoria: ${e}`);
        console.error(e);
      }
    } else {
      this.toastService.showError("POR FAVOR! verifica los datos del formulario.");
      return;
    }
  }
}
