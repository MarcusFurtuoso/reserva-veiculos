import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  template: `

    <div class="mb-4 flex items-center cursor-pointer">
      <div>
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 48 48"
          role="img"
          width="24px"
          height="24px"
          fill="none"
        >
          <path
            stroke="currentColor"
            stroke-width="3"
            d="M7.5 42v-6a7.5 7.5 0 017.5-7.5h18a7.5 7.5 0 017.5 7.5v6m-9-27a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
          ></path>
        </svg>
      </div>
      <h2 class="pl-6 text-lg">Detalhes da conta</h2>
    </div>

    <div class="mb-4 flex items-center cursor-pointer">
      <div>
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 48 48"
          role="img"
          width="24px"
          height="24px"
          fill="none"
        >
          <path
            stroke="currentColor"
            stroke-width="3"
            d="M7.5 19.5h33m-4.5 18H12A4.502 4.502 0 017.5 33V15a4.5 4.5 0 014.5-4.5h24a4.5 4.5 0 014.5 4.5v18c0 2.484-2.016 4.5-4.5 4.5z"
          ></path>
        </svg>
      </div>
      <h2 class="pl-6 text-lg">Métodos de pagamento</h2>
    </div>

    <div class="mb-4 flex items-center cursor-pointer">
      <div>
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 48 48"
          role="img"
          width="24px"
          height="24px"
          fill="none"
        >
          <path
            stroke="currentColor"
            stroke-miterlimit="10"
            stroke-width="3"
            d="M24 27V13c0-3.48 2.02-5.5 4.5-5.5h8.78l3.22 12m0 0h-33m33 0v21h-33v-21m0 0l3.22-12H21"
          ></path>
        </svg>
      </div>
      <h2 class="pl-6 text-lg">Endereço</h2>
    </div>

    <div class="mb-4 flex items-center cursor-pointer">
      <div>
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 48 48"
          role="img"
          width="24px"
          height="24px"
          fill="none"
        >
          <path
            stroke="currentColor"
            stroke-width="3"
            d="M39.135 12.201L27.177 24.16a4.503 4.503 0 01-6.364 0l-11.1-11.098c-.944-.944-.276-2.562 1.062-2.562h25.226c2.484 0 4.5 2.016 4.5 4.5v18a4.5 4.5 0 01-4.5 4.5h-24a4.5 4.5 0 01-4.5-4.5V18"
          ></path>
        </svg>
      </div>
      <h2 class="pl-6 text-lg">Preferência de comunicação</h2>
    </div>

    <div class="mb-4 flex items-center cursor-pointer">
      <div>
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 48 48"
          role="img"
          width="24px"
          height="24px"
          fill="none"
        >
          <path
            stroke="currentColor"
            stroke-width="3"
            d="M43.5 21v13.5a3 3 0 01-3 3h-33a3 3 0 01-3-3V21m6.615-4.5h25.77m-25.77 0l5.304-5.303M11.115 16.5l5.304 5.303M36.885 16.5l-5.304-5.303m5.304 5.303l-5.304 5.303M34.5 38v-5M24 38v-5m-10.5 5v-5"
          ></path>
        </svg>
      </div>
      <h2 class="pl-6 text-lg">Preferência de compras</h2>
    </div>

    <div class="mb-4 flex items-center cursor-pointer">
      <div>
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 48 48"
          role="img"
          width="24px"
          height="24px"
          fill="none"
        >
          <path
            stroke="currentColor"
            stroke-width="3"
            d="M4.5 42v-6a7.5 7.5 0 017.5-7.5h12a7.5 7.5 0 017.5 7.5v6m14.41-23.666l-9.546 9.546-5.304-5.302M25.5 15a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
          ></path>
        </svg>
      </div>
      <h2 class="pl-6 text-lg">Privacidade</h2>
    </div>
  `,
})
export class SidebarComponent {}
