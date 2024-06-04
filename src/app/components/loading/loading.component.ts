import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [],
  template: `
    <div class="fixed inset-0 flex items-center justify-center z-50">
      <div class="absolute inset-0 bg-black opacity-50"></div>
      <div class="flex flex-row gap-2">
        <div class="w-4 h-4 rounded-full bg-[#ED5A2F] animate-bounce"></div>
        <div class="w-4 h-4 rounded-full bg-[#ED5A2F] animate-bounce [animation-delay:-.3s]"></div>
        <div class="w-4 h-4 rounded-full bg-[#ED5A2F] animate-bounce [animation-delay:-.5s]"></div>
      </div>
    </div>
  `,
})
export class LoadingComponent {}
