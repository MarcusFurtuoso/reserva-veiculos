import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {

  if (inject(AuthService).isAdmin) {
    return true;
  }

  inject(Router).navigate(['home']);
  return false;
};
