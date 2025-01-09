import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle} from "@ng-bootstrap/ng-bootstrap";
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../../auth/services/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-purchasing-navbar',
  standalone: true,
  imports: [
    NgbDropdown,
    NgbDropdownItem,
    NgbDropdownMenu,
    NgbDropdownToggle,
    RouterLink
  ],
  templateUrl: './purchasing-navbar.component.html',
  styleUrl: './purchasing-navbar.component.scss'
})
export class PurchasingNavbarComponent  implements OnInit, OnDestroy {
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
  async logout() {
    try {
      await this.authService.logout();
      await this.router.navigate(['auth']);

    } catch (e) {
      console.error('ERROR! al cerrar sesión.', e);
    }
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
