import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 z-50"></div>
    <div class="fixed inset-0 flex justify-center items-center z-50">
      <div class="bg-white w-1/2 p-6 rounded-lg">
        <h1 class="text-2xl font-bold">{{ title }}</h1>
        <p class="text-lg">{{ message }}</p>
        <div class="flex justify-end mt-4">
          <button
            *ngIf="showCancel"
            class="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
          >
            {{ cancel }}
          </button>
          <button
            *ngIf="showConfirm"
            class="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            {{ confirm }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class DialogComponent {
  @Input() title?: string;
  @Input() message?: string;
  @Input() confirm?: string;
  @Input() cancel?: string;
  @Input() showCancel?: boolean;
  @Input() showConfirm?: boolean;
}
