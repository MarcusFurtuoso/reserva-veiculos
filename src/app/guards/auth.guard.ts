import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  if(localStorage.getItem('token')) {
    return true;
  }

  inject(Router).navigate(['auth']);
  return false;
};

export const authAdminGuard: CanActivateFn = (route, state) => {

  if(localStorage.getItem('token') && inject(AuthService).isAdmin) {
    return true;
  }

  if(localStorage.getItem('token') && !inject(AuthService).isAdmin) {
    inject(Router).navigate(['home']);
    return false;
  }

  inject(Router).navigate(['auth']);
  return false;
};
