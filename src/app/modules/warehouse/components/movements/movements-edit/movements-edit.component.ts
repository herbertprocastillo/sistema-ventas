import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {Movement} from '../../../interfaces/warehouse';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-movements-edit',
  standalone: true,
  imports: [],
  templateUrl: './movements-edit.component.html',
  styleUrl: './movements-edit.component.scss'
})
export class MovementsEditComponent {
  /** IO **/
  @Input() movement: Movement | null = null;
  @Output() template = new EventEmitter<string>();
  @Output() editCancel = new EventEmitter<boolean>();

  /** INJECT **/
  private fb = inject(FormBuilder);

  getCancel(value: boolean): void {
    this.editCancel.emit(value);
  }
}
