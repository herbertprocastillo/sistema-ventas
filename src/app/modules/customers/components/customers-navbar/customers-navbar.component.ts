import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../auth/services/auth.service';
import {Subscription} from 'rxjs';
import {NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-customers-navbar',
  standalone: true,
  imports: [
    NgbDropdown,
    NgbDropdownItem,
    NgbDropdownMenu,
    NgbDropdownToggle,
    RouterLink
  ],
  templateUrl: './customers-navbar.component.html',
  styleUrl: './customers-navbar.component.scss'
})
export class CustomersNavbarComponent implements OnInit, OnDestroy {
  /** INJECTS **/
  private router = inject(Router);
  private authService = inject(AuthService);

  /** VARIABLES **/
  public collapsed: boolean = true;
  public displayName: string | null = null;
  private userSubscription: Subscription | null = null;

  ngOnInit(): void {
    const userData$ = this.authService.getCurrentUserDataFirestore();
    if (userData$) {
      userData$.subscribe({
        next: (userData) => {
          this.displayName = userData?.displayName || 'Usuario';
        },
        error: (error) => {
          console.error('error al obtener los datos del usuario', error);
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  async logout() {
    try {
      await this.authService.logout();
      await this.router.navigate(['/auth']);

    } catch (e) {
      console.error('ERROR! al cerrar sesión:', e);
    }
  }
}
