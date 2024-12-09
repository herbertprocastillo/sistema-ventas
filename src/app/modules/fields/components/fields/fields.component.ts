import {Component} from '@angular/core';
import {FieldsNavbarComponent} from '../fields-navbar/fields-navbar.component';
import {Field} from '../../interfaces/field';
import {RouterLink} from '@angular/router';
import {FieldsEditComponent} from '../fields-edit/fields-edit.component';
import {FieldsNewComponent} from '../fields-new/fields-new.component';
import {FieldsListComponent} from '../fields-list/fields-list.component';

@Component({
  selector: 'app-fields',
  standalone: true,
  imports: [
    FieldsNavbarComponent,
    RouterLink,
    FieldsEditComponent,
    FieldsNewComponent,
    FieldsListComponent
  ],
  templateUrl: './fields.component.html',
  styleUrl: './fields.component.scss'
})
export class FieldsComponent {
  /** VARIABLES **/
  public editField: Field | null = null;
  public fields: Field[] = [];

  getEditField(field: Field) {
    this.editField = field;
  }

  getListFields(fields: Field[]): void {
    this.fields = fields;
  }

  getCancel(cancel: boolean) {
    if (cancel) {
      this.editField = null;
    }
  }
}
