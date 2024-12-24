import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {Category} from '../../../interfaces/product';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ToastService} from '../../../../../shared/toast/services/toast.service';
import {NgIf} from '@angular/common';
import {ProductsService} from '../../../services/products.service';

@Component({
  selector: 'app-products-category-edit',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './products-category-edit.component.html',
  styleUrl: './products-category-edit.component.scss'
})
export class ProductsCategoryEditComponent implements OnInit {
  /** IO **/
  @Input() category: Category | null = null;
  @Output() editCancel = new EventEmitter<boolean>();

  /** INJECTS **/
  private fb = inject(FormBuilder);
  private productsService = inject(ProductsService);
  private toastService = inject(ToastService);

  /** VARIABLES **/
  public editForm: FormGroup;

  constructor() {
    this.editForm = this.fb.group({
      name: ['', [Validators.required]],
    });
  }

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
        this.toastService.showSuccess("Categoria actualizada con EXITO!.");
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
