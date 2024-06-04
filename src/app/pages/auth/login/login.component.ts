import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ForgotPasswordComponent } from '../../../components/forgot-password/forgot-password.component';
import { InputComponent } from '../../../components/input/input.component';
import { LogoComponent } from '../../../components/logo/logo.component';
import { ITokenDto } from '../../../models/dtos/user-login-dto';
import { User } from '../../../models/forms/user.model';
import { AlertService } from '../../../service/alert.service';
import { AuthService } from '../../../service/auth.service';
import { LoadingService } from '../../../service/loading.service';
import { LocalStorageService } from '../../../service/local-storage.service';
import { MessageErrorResolver } from '../../../utils/message-error-resolver';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, ForgotPasswordComponent, InputComponent, LogoComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  user: User = new User();

  readonly #router = inject(Router);
  readonly #localStorageService = inject(LocalStorageService);
  readonly #authService = inject(AuthService);
  readonly #alertService = inject(AlertService);
  readonly #loadingService = inject(LoadingService);
  protected messageError = inject(MessageErrorResolver);

  onSubmit() {
    this.#loadingService.isLoading.next(true);
    if(this.user) {
      this.#authService.login(this.user).subscribe({
        next: (userResponse: ITokenDto) => {
          // console.log(userResponse);

          setTimeout(() => {
            this.#loadingService.isLoading.next(false);
            this.#alertService.success('Login successful!');
            this.navigateToHome();
          }, 300);
        },
        error: (error: any) => {
          console.log(error);
          this.#loadingService.isLoading.next(false);
          this.#alertService.error('Error when authenticating!');
        }
      });
    }
  }

  navigateToForgotPassword() {
    this.#router.navigate(['forgot-password']);
  }

  navigateToHome() {
    this.#router.navigate(['home']);
  }

  navigateToRegister() {
    this.#router.navigate(['register']);
  }

}
