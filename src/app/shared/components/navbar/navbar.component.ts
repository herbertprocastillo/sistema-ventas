import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle} from '@ng-bootstrap/ng-bootstrap';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../modules/auth/services/auth.service';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgbDropdownMenu,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownItem,
    RouterLink
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {
  /** INJECTS **/
  public router = inject(Router);
  public authService = inject(AuthService);

  /** VARIABLES **/
  public collapsed: boolean = true;
  public displayName: string | null = null;
  private destroy$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    const userData$ = this.authService.getCurrentUserDataFirestore();
    if (userData$) {
      userData$.pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (userData) => {
            this.displayName = userData?.displayName || 'Usuario';
          },
          error: (e) => {
            console.error('error al obtener los datos del usuario', e);
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async logout() {
    try {
      await this.authService.logout();
      await this.router.navigate(['auth']);

    } catch (e) {
      console.error('ERROR! al cerrar sesión.', e);
    }
  }
}
