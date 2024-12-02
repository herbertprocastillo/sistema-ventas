import {Component, inject, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ProductsService} from '../../services/products.service';
import {ToastService} from '../../../../shared/toast/services/toast.service';
import {Observable} from 'rxjs';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {Category} from '../../interfaces/product';
import {CategoriesService} from '../../services/categories.service';

@Component({
  selector: 'app-products-new',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    NgForOf,
    NgIf
  ],
  templateUrl: './products-new.component.html',
  styleUrl: './products-new.component.scss'
})
export class ProductsNewComponent {
  /** IO **/
  @ViewChild('imageInput') imageInput: any;

  /** INJECTS **/
  private categoriesService = inject(CategoriesService);
  private productsService = inject(ProductsService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  /** VARIABLES **/
  public newForm: FormGroup;
  public previewUrl: string | ArrayBuffer | null = null;
  public selectedFile: File | null = null;

  /** COLLECTIONS **/
  public listCategories$: Observable<Category[]>;

  constructor() {
    this.newForm = this.fb.group({
      category_id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(1)]],
      barCode: ['', [Validators.required]],
      imageUrl: [null, [Validators.required]],
    });

    this.listCategories$ = this.categoriesService.getCategories();
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
        this.newForm.patchValue({imageUrl: this.previewUrl});
      };
      reader.readAsDataURL(file);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.newForm.valid) {
      if (!this.selectedFile) {
        this.toastService.showError("ERROR! Por favor, seleccione una imagen.");
        return;
      }
      const productData = {...this.newForm.value};
      try {
        await this.productsService.addProduct(productData, this.selectedFile);
        this.toastService.showSuccess("EXITO! Producto registrado exitosamente.");
        this.newForm.reset();
        this.previewUrl = null;
        this.selectedFile = null;
        this.imageInput.nativeElement.value = '';

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
