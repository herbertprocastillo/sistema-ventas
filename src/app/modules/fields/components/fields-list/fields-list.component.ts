import {Component, EventEmitter, inject, OnDestroy, OnInit, Output} from '@angular/core';
import {Field} from '../../interfaces/field';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from '../../../../shared/toast/services/toast.service';
import {Subject, takeUntil} from 'rxjs';
import {FieldsService} from '../../services/fields.service';
import {CurrencyPipe, DatePipe, DecimalPipe, SlicePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {UsersByIdComponent} from '../../../users/components/users-by-id/users-by-id.component';

@Component({
  selector: 'app-fields-list',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    NgbPagination,
    SlicePipe,
    UsersByIdComponent,
    DecimalPipe,
    CurrencyPipe
  ],
  templateUrl: './fields-list.component.html',
  styleUrl: './fields-list.component.scss'
})
export class FieldsListComponent implements OnInit, OnDestroy {
  /** IO **/
  @Output() field = new EventEmitter<Field>();
  @Output() fields = new EventEmitter<Field[]>();

  /** INJECT **/
  private fieldsService = inject(FieldsService);
  private modalService = inject(NgbModal);
  private toastService = inject(ToastService);

  /** COLLECTION **/
  public listFields: Field[] = [];

  /** VARIABLES **/
  public page: number = 1;
  public pageSize: number = 10;
  public searchTerm: string = '';

  /** SUBSCRIPTION **/
  private destroy$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.fieldsService.getFields()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: Field[]) => {
          this.listFields = data;
          this.fields.emit(this.listFields);
        },
        error: (e) => console.log("ERROR: ", e)
      });
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getEditField(field: Field): void {
    this.field.emit(field);
  }

  filteredFields(): Field[] {
    const searchTerm: string = this.searchTerm.trim().toLowerCase();
    return this.listFields.filter((field: Field) =>
      field.name.toLowerCase().includes(searchTerm));
  }

  async openDeleteModal(content: any, fieldId: string | undefined): Promise<void> {
    if (!fieldId) {
      this.toastService.showError('El ID del campo no es válido.');
      return;
    }
    try {
      const modalRef = this.modalService.open(content, {backdrop: 'static'});
      const result = await modalRef.result;
      if (result === 'confirm') {
        await this.deleteField(fieldId);
      }
    } catch (error) {
      console.log('Modal cerrado sin confirmación', error);
    }
  }

  async deleteField(fieldId: string): Promise<void> {
    try {
      await this.fieldsService.deleteField(fieldId);
      this.toastService.showSuccess('EXITO! Campo eliminado correctamente.');
    } catch (e) {
      this.toastService.showError(`ERROR! al eliminar el campo. ${e}`);
    }
  }

}
