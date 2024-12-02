import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../auth/services/auth.service';
import {ToastService} from '../../../../shared/toast/services/toast.service';

@Component({
  selector: 'app-users-new',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './users-new.component.html',
  styleUrl: './users-new.component.scss'
})
export class UsersNewComponent {
  public newUserForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private authService: AuthService) {

    this.newUserForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      displayName: ['', Validators.required],
      role: ['empleado', Validators.required]
    });
  }

  async onSubmit() {
    const adminEmail = "admin@admin.com";
    const adminPassword = "H.arrison82";

    if (this.newUserForm.valid) {
      const {email, password, displayName, role} = this.newUserForm.value;
      try {
        await this.authService.addUser(adminEmail, adminPassword, email, password, displayName, role);
        this.toastService.showSuccess("Usuario registrado exitosamente");
        this.newUserForm.reset();

      } catch (error) {
        this.toastService.showError(`Error al registrar el usuairo", ${error}`);
      }
    }
  }
}
