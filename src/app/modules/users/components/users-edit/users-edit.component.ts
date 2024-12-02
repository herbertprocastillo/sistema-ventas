import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {User as AppUser} from '../../interfaces/user';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../auth/services/auth.service';
import {ToastService} from '../../../../shared/toast/services/toast.service';

@Component({
  selector: 'app-users-edit',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './users-edit.component.html',
  styleUrl: './users-edit.component.scss'
})
export class UsersEditComponent implements OnInit {
  /** IO **/
  @Input() user: AppUser | null = null;
  @Output() editCancel = new EventEmitter<boolean>();

  /** injects **/
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);

  /** variables **/
  public editUserForm: FormGroup;

  constructor() {
    this.editUserForm = this.fb.group({
      displayName: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.user) {
      this.editUserForm.patchValue(this.user);
    }
  }

  async onSubmit() {
    if (this.editUserForm.valid && this.user) {
      try {
        const updatedUser = {...this.user, ...this.editUserForm.value};
        await this.authService.updateUser(updatedUser.id, updatedUser);
        this.toastService.showSuccess("Usuario actualizado exitosamente");
        this.getBack();
      } catch (error) {
        this.toastService.showError(`Error al actualizar el usuairo", ${error}`);
      }
    }
  }

  getBack() {
    this.editCancel.emit(true);
  }
}
