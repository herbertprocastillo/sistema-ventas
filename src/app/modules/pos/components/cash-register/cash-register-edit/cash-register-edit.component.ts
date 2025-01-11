import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CashRegister} from '../../../interfaces/pos';

@Component({
  selector: 'app-cash-register-edit',
  standalone: true,
  imports: [],
  templateUrl: './cash-register-edit.component.html',
  styleUrl: './cash-register-edit.component.scss'
})
export class CashRegisterEditComponent {
  /** IO **/
  @Input() cashRegister: CashRegister | null = null;
  @Output() editCancel = new EventEmitter<boolean>();

}
