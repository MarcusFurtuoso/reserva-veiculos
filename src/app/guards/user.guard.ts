import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const userGuard: CanActivateFn = (route, state) => {

  if (!inject(AuthService).isAdmin) {
    return true;
  }

  inject(Router).navigate(['admin', 'vehicles']);
  return false;
};

export const userReservesGuard: CanActivateFn = (route, state) => {

  if (localStorage.getItem('token') && !inject(AuthService).isAdmin){
    return true;
  }

  if (localStorage.getItem('token') && inject(AuthService).isAdmin){
    inject(Router).navigate(['admin']);
    return false;
  }

  inject(Router).navigate(['auth']);
  return false;
};
