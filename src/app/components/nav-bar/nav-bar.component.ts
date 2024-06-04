import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { LogoComponent } from '../logo/logo.component';
import { Subscription } from 'rxjs';
import { CartReserveService } from '../../service/cart-reserve.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'nav-bar',
  standalone: true,
  imports: [LogoComponent, CommonModule, FontAwesomeModule],
  template: `
    <header class="bg-white border-b sticky top-0 z-10">
      <nav class="mx-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <img
            (click)="navigateToHome()"
            class="h-12 w-auto cursor-pointer"
            src="assets/logo/logo.png"
            alt="Home"
          />

          <!-- End Nav -->
          <div class="hidden md:block">
            <div class="ml- p-1 space-x-6 text-gray-400 hover:text-gray-500">
              <!-- Reservation Icon -->
              @if(!isAdmin) {
                <button (click)="navigateToReserves()" class="relative">
                  <div
                    class="absolute top-4 right-0 bg-[#ED5A2F] text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                  >
                    {{ cartService.getVehiclesInCart() | async }}
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="black"
                    class="w-7 h-7"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
                    />
                  </svg>
                </button>
              }

              <!-- User Icon -->
              <button class="" (click)="navigateToUser()">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="black"
                  class="w-7 h-7"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </button>

              <!-- Logout Icon -->
              <button class="" (click)="show()">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="black"
                  class="w-7 h-7"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>

    <dialog
      [style.display]="isDialogOpen ? 'block' : 'none'"
      class="rounded-2xl bg-transparent backdrop:bg-black/50 fixed inset-0 z-50"
      #dialogRef
    >
      <div
        class="group select-none w-[20rem] flex flex-col p-4 relative items-center  bg-zinc-800 border border-zinc-800 shadow-lg rounded-2xl"
      >
        <div class="">
          <div class="text-center p-3 flex-auto justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="group-hover:animate-bounce w-10 h-10 flex items-center text-gray-600 fill-red-600 mx-auto"
            >
              <path
                fill-rule="evenodd"
                d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm10.72 4.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H9a.75.75 0 0 1 0-1.5h10.94l-1.72-1.72a.75.75 0 0 1 0-1.06Z"
                clip-rule="evenodd"
              />
            </svg>
            <h2 class="text-xl font-bold py-4 text-gray-200">Logout</h2>
            <p class="font-bold text-sm text-gray-500 px-2">
            Do you want to end the session?
            </p>
          </div>
          <div class="p-2 mt-2 text-center space-x-2 md:block">
            <button
              (click)="close()"
              class="mb-2 md:mb-0 bg-gray-700 px-5 py-2 text-sm shadow-sm font-medium tracking-wider border-2 border-gray-600 hover:border-gray-700 text-gray-300 rounded-full hover:shadow-lg hover:bg-gray-800 transition ease-in duration-300"
            >
              Cancel
            </button>
            <button
              (click)="logout()"
              class="bg-red-600 hover:bg-transparent px-5 ml-4 py-2 text-sm shadow-sm hover:shadow-lg font-medium tracking-wider border-2 border-red-600 hover:border-red-600 text-white hover:text-red-600 rounded-full transition ease-in duration-300"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </dialog>
  `,
})
export class NavBarComponent implements OnInit, OnDestroy {
  readonly #router = inject(Router);
  readonly #authService = inject(AuthService);
  protected cartService = inject(CartReserveService);

  sub?: Subscription;

  isDialogOpen = false;

  isAdmin: boolean = false;

  @ViewChild('dialogRef') dialogRef!: ElementRef<HTMLDialogElement>;

  ngOnInit() {
    this.sub = this.cartService.getVehiclesInCart().subscribe((qtdVehicles) => {
      // console.log(qtdVehicles);
    });
    this.isAdmin = this.#authService.verifyIsAdmin();
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  selectedButton: HTMLElement | null = null;

  public toggleBorder(event: Event) {
    const element = event.target as HTMLElement;

    if (this.selectedButton) {
      this.selectedButton.classList.remove('border-b-2', 'border-orange-500');
    }

    element.classList.add('border-b-2', 'border-orange-500');

    this.selectedButton = element;
  }

  logout() {
    this.#authService.logout();
  }

  show() {
    this.isDialogOpen = true;
    this.dialogRef.nativeElement.showModal();
  }

  close() {
    this.isDialogOpen = false;
    this.dialogRef.nativeElement.close();
  }

  public navigateToHome() {
    this.#router.navigate(['/home']);
  }
  public navigateToUser() {
    this.#router.navigate(['/user']);
  }

  public navigateToReserves() {
    this.#router.navigate(['reserves']);
  }
}
