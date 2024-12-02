import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle} from "@ng-bootstrap/ng-bootstrap";
import {Subscription} from 'rxjs';
import {AuthService} from '../../../auth/services/auth.service';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-pos-navbar',
  standalone: true,
  imports: [
    NgbDropdown,
    NgbDropdownItem,
    NgbDropdownMenu,
    NgbDropdownToggle,
    RouterLink
  ],
  templateUrl: './pos-navbar.component.html',
  styleUrl: './pos-navbar.component.scss'
})
export class PosNavbarComponent implements OnInit, OnDestroy {
  public collapsed: boolean = true;
  public displayName: string | null = null;
  private userSubscription: Subscription | null = null;

  constructor(private authService: AuthService, private router: Router) {
  }

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
      await this.router.navigate(['/auth']);

    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
