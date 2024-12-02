import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgIf],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {
  /** injects **/
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  /** variables **/
  public loginForm: FormGroup;
  public loading: boolean = false;
  public errorMessage: string | null = null;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = null;
      const {email, password} = this.loginForm.value;

      try {
        await this.authService.login(email, password);
        await this.router.navigate(['home']);

      } catch (e) {
        this.errorMessage = 'ERROR! Verifica tus credenciales';
        console.error(e);
        this.loading = false;
      }
    } else {
      return;
    }
  }
}
