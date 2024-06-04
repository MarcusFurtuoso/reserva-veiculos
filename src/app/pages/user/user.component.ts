import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { User } from '../../models/forms/user.model';
import { Subscription } from 'rxjs';
import { UserAuthResponse } from '../../models/dtos/token-payload';
import { InputComponent } from '../../components/input/input.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FormsModule, InputComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit, OnDestroy {

  readonly #authService = inject(AuthService);

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

  onSubmit() {

  }

}
