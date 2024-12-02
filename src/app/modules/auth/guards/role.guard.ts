import {CanActivateFn} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {map, take} from 'rxjs/operators';
import {of} from 'rxjs';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRole = route.data['role'];

  const userData$ = authService.getCurrentUserDataFirestore();
  if (!userData$) {
    router.navigate(['/unauthorized']);
    return of(false);
  }

  return userData$.pipe(
    take(1),
    map(user => {
      if (user && user.role === requiredRole) {
        return true;
      } else {
        router.navigate(['/unauthorized']);
        return false;
      }
    })
  );
};
