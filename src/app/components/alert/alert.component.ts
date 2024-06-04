import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Alert, AlertService } from '../../service/alert.service';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
        <div
      class="p-4 rounded-md mb-4"
      [ngClass]="{
        'bg-green-100 text-green-800': alert?.type === 'success',
        'bg-red-100 text-red-800': alert?.type === 'error',
        'bg-blue-100 text-blue-800': alert?.type === 'info',
        'bg-yellow-100 text-yellow-800': alert?.type === 'warn'
      }"
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <svg
            class="h-5 w-5"
            [ngClass]="{
              'text-green-400': alert?.type === 'success',
              'text-red-400': alert?.type === 'error',
              'text-blue-400': alert?.type === 'info',
              'text-yellow-400': alert?.type === 'warn'
            }"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              [attr.d]="
                alert?.type === 'success'
                  ? 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                  : alert?.type === 'error'
                  ? 'M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v4a1 1 0 102 0V5zm-1 8a1 1 0 100-2 1 1 0 000 2z'
                  : alert?.type === 'info'
                  ? 'M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v4a1 1 0 102 0V5zm-1 8a1 1 0 100-2 1 1 0 000 2z'
                  : 'M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v4a1 1 0 102 0V5zm-1 8a1 1 0 100-2 1 1 0 000 2z'
              "
              clip-rule="evenodd"
            ></path>
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm leading-5 font-medium">
            {{ alert?.message }}
          </p>
        </div>
      </div>
    </div>
  `,
})
export class AlertComponent {
  @Input() alert: Alert | null = null;
}
