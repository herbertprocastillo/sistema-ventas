import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {Field} from '../../interfaces/field';
import {FormBuilder} from '@angular/forms';
import {FieldsService} from '../../services/fields.service';
import {ToastService} from '../../../../shared/toast/services/toast.service';

@Component({
  selector: 'app-fields-edit',
  standalone: true,
  imports: [],
  templateUrl: './fields-edit.component.html',
  styleUrl: './fields-edit.component.scss'
})
export class FieldsEditComponent {
  /** IO **/
  @Input() field: Field | null = null;
  @Output() editCancel = new EventEmitter<boolean>();
  /** INJECTS **/
  private fb = inject(FormBuilder);
  private fieldsService = inject(FieldsService);
  private toastService = inject(ToastService);



}
