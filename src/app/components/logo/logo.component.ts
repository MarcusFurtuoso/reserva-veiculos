import { Component } from '@angular/core';

@Component({
  selector: 'logo',
  standalone: true,
  imports: [],
  template: `
    <img
    class="mx-auto h-24 w-auto"
      src="assets/logo/logo.png"
      alt="Logo"
    />
  `,
})
export class LogoComponent {}
