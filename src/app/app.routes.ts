import { Routes } from '@angular/router';
import { AdminAllProfilesComponent } from './components/admin-all-profiles/admin-all-profiles.component';
import { AdminUserProfileComponent } from './components/admin-user-profile/admin-user-profile.component';
import { AdminVehiclesComponent } from './components/admin-vehicles/admin-vehicles.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ListReservationComponent } from './components/list-reservation/list-reservation.component';
import { ListVehiclesComponent } from './components/list-vehicles/list-vehicles.component';
import { ReservePdfComponent } from './components/reserve-pdf/reserve-pdf.component';
import { AddUpdateVehicleComponent } from './pages/add-update-vehicle/add-update-vehicle.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { ReservesComponent } from './pages/reserves/reserves.component';
import { UserComponent } from './pages/user/user.component';
import { adminGuard } from './guards/admin.guard';
import { userGuard, userReservesGuard } from './guards/user.guard';
import { authAdminGuard, authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },

  {
    path: 'user',
    canActivate: [authGuard],
    component: UserComponent,
    children: [
      {
        path: 'reserves',
        canActivate: [userReservesGuard],
        component: ReservesComponent,
      },
    ],
  },

  {
    path: 'home',
    canActivate: [authGuard],
    component: HomeComponent,
    children: [
      {
        path: 'vehicles/:type',
        canActivate: [userGuard],
        component: ListVehiclesComponent,
      },
      {
        path: 'reservations',
        canActivate: [userGuard],
        component: ListReservationComponent,
      },
      {
        path: '',
        redirectTo: 'vehicles/cars',
        pathMatch: 'full',
      },
    ],
  },

  {
    path: 'reserve-pdf/:reserveId',
    canActivate: [userReservesGuard],
    component: ReservePdfComponent,
  },

  {
    path: 'admin',
    canActivate: [authAdminGuard],
    component: HomeComponent,
    children: [
      {
        path: 'vehicles',
        canActivate: [adminGuard],
        component: AdminVehiclesComponent,
      },
      {
        canActivate: [adminGuard],
        path: 'profile-user',
        component: AdminUserProfileComponent,
      },
      {
        path: 'all-profiles',
        canActivate: [adminGuard],
        component: AdminAllProfilesComponent,
      },
      {
        path: '',
        redirectTo: 'vehicles',
        pathMatch: 'full',
      },
    ],
  },

  {
    path: 'admin/add-vehicle',
    canActivate: [authAdminGuard],
    component: AddUpdateVehicleComponent,
  },
  {
    path: 'admin/update-vehicle/:vehicleId',
    canActivate: [authAdminGuard],
    component: AddUpdateVehicleComponent,
  },

  { path: '', redirectTo: 'auth', pathMatch: 'full' },
];
