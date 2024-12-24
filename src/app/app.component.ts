import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {ToastComponent} from './shared/toast/components/toast/toast.component';
import {NavbarComponent} from './shared/components/navbar/navbar.component';
import {Subject, takeUntil} from 'rxjs';
import {AuthService} from './modules/auth/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  /** INJECTS **/


  /** VARIABLES **/
  public collapsed: boolean = true;
  public displayName: string = '';
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private authService: AuthService, private router: Router,) {
  }

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
