import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { InputComponent } from '../../../components/input/input.component';
import { LogoComponent } from '../../../components/logo/logo.component';
import { IUserRegisterResponse } from '../../../models/dtos/user-register-dto';
import { User } from '../../../models/forms/user.model';
import { AlertService } from '../../../service/alert.service';
import { AuthService } from '../../../service/auth.service';
import { LoadingService } from '../../../service/loading.service';
import { MessageErrorResolver } from '../../../utils/message-error-resolver';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BackButtonComponent,
    InputComponent,
    LogoComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {

  user: User = new User();

  confirmPassword: string = '';

  readonly #router = inject(Router);
  readonly #authService = inject(AuthService);
  readonly #alertService = inject(AlertService);
  readonly #loadingService = inject(LoadingService);
  protected messageError = inject(MessageErrorResolver);

  onSubmit() {
    this.#loadingService.isLoading.next(true);
    if (this.user) {
      this.#authService.register(this.user).subscribe({
        next: (userResponse: IUserRegisterResponse) => {
          console.log(userResponse);

          setTimeout(() => {
            this.#loadingService.isLoading.next(false);
            this.#alertService.success(`Registration successful ${userResponse.usuario.nome}!`);
            this.navigateToLogin();
          }, 500);
        },
        error: (error: any) => {
          console.log(error);
          this.#alertService.error('Error when registering!');
        },
      });
    }
  }

  navigateToLogin() {
    this.#router.navigate(['auth']);
  }
}
