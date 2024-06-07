import { Component } from '@angular/core';

@Component({
  selector: 'logo',
  standalone: true,
  imports: [],
  template: `
    <img
    class="mx-auto h-24 w-auto"
      src="assets/logo/logo-1.png"
      alt="Logo"
    />
  `,
})
export class LogoComponent {}
