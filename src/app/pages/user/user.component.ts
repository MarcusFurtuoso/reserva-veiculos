import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Subscription } from 'rxjs';
import { InputComponent } from '../../components/input/input.component';
import { UserAuthResponse } from '../../models/dtos/token-payload';
import { UserUpdateForm } from '../../models/forms/user-update-form';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FormsModule, InputComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit, OnDestroy {

  readonly #authService = inject(AuthService);
  readonly #router = inject(Router);

  usuario?: UserAuthResponse;

  sub?: Subscription;

  isAdmin: boolean = false;

  ngOnInit(): void {
    this.getUsuario();
    this.verifyIfIsAdmin();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private getUsuario() {
    this.sub = this.#authService.getUsuarioLogged().subscribe({
      next: (response) => {
        this.usuario = response?.user;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  private verifyIfIsAdmin() {
    this.isAdmin = this.#authService.verifyIsAdmin();
  }

  navigateToHome() {
    this.#router.navigate(['home']);
  }

}
