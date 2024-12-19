import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {Category, Product} from '../../interfaces/product';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ProductsService} from '../../services/products.service';
import {ToastService} from '../../../../shared/toast/services/toast.service';
import {Observable} from 'rxjs';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-products-edit',
  standalone: true,
  imports: [
    AsyncPipe,
    NgForOf,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './products-edit.component.html',
  styleUrl: './products-edit.component.scss'
})
export class ProductsEditComponent implements OnInit {
  /** IO **/
  @Input() product: Product | null = null;
  @Output() editCancel = new EventEmitter<boolean>();

  /** INJECTS **/
  private productsService = inject(ProductsService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  /** VARIABLES **/
  public editForm: FormGroup;
  public previewUrl: string | ArrayBuffer | null = null;
  public selectedFile: File | null = null;

  /** COLLECTIONS **/
  public listCategories$: Observable<Category[]>;

  constructor() {
    this.editForm = this.fb.group({
      category_id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: ['', [Validators.required]],
      barCode: ['', [Validators.required]],
      imageUrl: [null, [Validators.required]],
    });

    this.listCategories$ = this.productsService.getCategories();
  }

  ngOnInit(): void {
    if (this.product) {
      this.editForm.patchValue(this.product);
      this.previewUrl = this.product.imageUrl || '';
    }
  }

  getCancel(value: boolean): void {
    this.editCancel.emit(value);
  }

  /** FILE IMAGE SELECT **/
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        this.toastService.showError('ERROR! Tipo de archivo no es permitido. Solo se aceptan imágenes (PNG, JPEG, WEBP).');
        return;
      }
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (): void => {
        this.previewUrl = reader.result;
        this.editForm.patchValue({imageUrl: this.previewUrl});
      };
      reader.readAsDataURL(file);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.editForm.valid && this.product) {

      const product = {...this.product, ...this.editForm.value};
      try {
        await this.productsService.updateProduct(product.id, product);
        this.toastService.showSuccess("EXITO! Producto actualizado correctamente.");
        this.editForm.reset();
        this.previewUrl = null;
        this.selectedFile = null;
        this.getCancel(true);

      } catch (e) {
        this.toastService.showError(`ERROR! al actualizar el producto. ${e}`);
        console.error("ERROR! al actualizar el producto.", e);
      }
    } else {
      return;
    }
  }


}
