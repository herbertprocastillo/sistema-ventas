import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle} from "@ng-bootstrap/ng-bootstrap";
import {Router, RouterLink} from '@angular/router';
import {Subscription} from 'rxjs';
import {AuthService} from '../../../auth/services/auth.service';

@Component({
  selector: 'app-products-navbar',
  standalone: true,
  imports: [
    NgbDropdown,
    NgbDropdownItem,
    NgbDropdownMenu,
    NgbDropdownToggle,
    RouterLink
  ],
  templateUrl: './products-navbar.component.html',
  styleUrl: './products-navbar.component.scss'
})
export class ProductsNavbarComponent implements OnInit, OnDestroy {
  /** injects **/
  private router = inject(Router);
  private authService = inject(AuthService);

  /** variables **/
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

  async getModule(module: string) {
    await this.router.navigate([module]);
  }

  async logout() {
    try {
      await this.authService.logout();
      await this.router.navigate(['/auth']);

    } catch (e) {
      console.error('ERROR! al cerrar sesión:', e);
    }
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
