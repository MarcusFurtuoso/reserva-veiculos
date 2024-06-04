import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/forms/user.model';
import { MessageErrorResolver } from '../../utils/message-error-resolver';
import { BackButtonComponent } from '../back-button/back-button.component';
import { InputComponent } from '../input/input.component';
import { LogoComponent } from '../logo/logo.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, BackButtonComponent, InputComponent, LogoComponent],
  template: `
    <body class="h-screen w-screen flex justify-center bg-gray-50">
      <div class="w-96 mt-32">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
          <logo></logo>
          <h2
            class="mt-8 text-center text-2xl font-bold leading-9 tracking-tight"
          >
            Reset your password
          </h2>
        </div>

        <div
          class="mt-8 bg-white shadow-md rounded-md p-4"
        >
          <back-button></back-button>

          <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
            <div>
              <app-input
                [required]="true"
                inputName="email"
                type="email"
                label="Email"
                placeholder="Enter your email"
                pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"
                [(ngModel)]="user.login"
                name="email"
                [error]="
                  messageError.showErrorMessageForKey(loginForm, 'email')
                "
              >
              </app-input>
              <div class="mt-5">
                <button
                  type="submit"
                  class="flex w-full justify-center font-medium px-6 py-1.5 rounded-md leading-6 text-white bg-zinc-950 hover:bg-zinc-800 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900"
                >
                  Send Email
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </body>
  `,
})
export class ForgotPasswordComponent {
  user: User = new User();

  protected messageError = inject(MessageErrorResolver);

  onSubmit() {
    console.log(this.user);
  }
}
