import {Component, inject, Input} from '@angular/core';
import {FieldsService} from '../../services/fields.service';
import {ToastService} from '../../../../shared/toast/services/toast.service';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {Field} from '../../interfaces/field';

@Component({
  selector: 'app-fields-new',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './fields-new.component.html',
  styleUrl: './fields-new.component.scss'
})
export class FieldsNewComponent {
  /** IO **/
  @Input() fields: Field[] = [];
  /** INJECT **/
  private fieldsService = inject(FieldsService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  /** VARIABLES **/
  public newForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    pricePerHour: [0, [Validators.required]],
    type: ['INDIVIDUAL', [Validators.required]],
    relatedFields: [[]]
  });

  /** COLLECTIONS **/
  public selectedFields: string[] = [];
  public availableFields: Field[] = [];

  onTypeChange() {
    const type = this.newForm.get('type')?.value;
    if (type === 'COMBINADO') {
      this.availableFields = this.fields.filter(
        field => field.type === 'INDIVIDUAL' && !this.isFieldRelated(field.id)
      );
      this.selectedFields = [];
    } else {
      this.availableFields = [];
    }
  }

  onFieldCheckChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const value = checkbox.value;

    if (checkbox.checked) {
      if (this.selectedFields.length < 2) {
        this.selectedFields.push(value);
      }
    } else {
      this.selectedFields = this.selectedFields.filter(id => id !== value);
    }
  }

  isFieldRelated(fieldId: string): boolean {
    return this.fields.some(
      field => field.type === 'COMBINADO' && field.relatedFields?.includes(fieldId)
    );
  }


  async onSubmit(): Promise<void> {
    if (this.newForm.valid) {

      const newField = {
        ...this.newForm.value,
        status: 'DISPONIBLE',
      };

      if (newField.type === 'COMBINADO') {
        newField.relatedFiels = this.selectedFields
      }

      newField.type = 'INDIVIDUAL';

      try {
        await this.fieldsService.addField(newField);
        this.newForm.reset();
        this.toastService.showSuccess("EXITO! Campo registrado correctamente.");

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
