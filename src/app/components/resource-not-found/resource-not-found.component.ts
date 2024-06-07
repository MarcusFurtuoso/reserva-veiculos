import { Component, Input, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'resource-not-found',
  standalone: true,
  imports: [],
  template: `
    <div class="flex flex-col justify-center items-center text-center">
      <div class="w-64 h-64 mb-5" [innerHTML]="svgSafe"></div>
        <p class="text-2xl font-bold text-zinc-900 mb-1">{{ title }}</p>
        <p class="text-lg text-zinc-700">
          {{ message }}
        </p>
      </div>
  `,
})
export class ResourceNotFoundComponent {

  #sanitizer = inject(DomSanitizer);

  svgSafe?: SafeHtml;
  @Input() title?: string;
  @Input() message?: string;

  @Input()
  set svg(value: string) {
    this.svgSafe = this.#sanitizer.bypassSecurityTrustHtml(value);
  }

}
