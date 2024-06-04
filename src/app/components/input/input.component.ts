import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

type InputTypes = 'text' | 'textarea' | 'email' | 'password' | 'number';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
    CurrencyPipe,
  ],
  template: `
    <label
      [for]="inputName"
      class="block text-sm font-medium leading-6 text-gray-900"
    >
      {{ label }}</label
    >
    <div class="mt-2">
      @if (type !== 'textarea') {

      <input
        [ngClass]="{ 'invalid:border-red-600': error }"
        [required]="required"
        [type]="type"
        [placeholder]="placeholder"
        [pattern]="pattern"
        (input)="onInput($event)"
        [value]="value"
        [name]="name"
        [disabled]="disabled"
        class="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
      />
      } @if (type === 'textarea') {
      <textarea
        maxlength="300"
        [ngClass]="{ 'invalid:border-red-600': error }"
        [required]="required"
        [placeholder]="placeholder"
        (input)="onInput($event)"
        [value]="value"
        [name]="name"
        class="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
      ></textarea>
      }
      <small
        class="text-xs"
        [ngClass]="{
          'text-red-600': error,
        }"
      >
        {{ error }}
      </small>
    </div>
  `,
})
export class InputComponent implements ControlValueAccessor {
  @Input() inputName: string = '';
  @Input() label: string = '';
  @Input() type: InputTypes = 'text';
  @Input() placeholder: string = '';
  @Input() pattern: string = '';
  @Input() required: boolean = false;
  @Input() name: string = '';
  @Input() error?: string;
  @Input() minlength?: number;
  @Input() maxlength?: number;
  @Input() disabled?: boolean;

  value: any = '';
  onChange: any = () => {};
  onTouch: any = () => {};

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.onChange(value);
  }

  writeValue(obj: any): void {
    if (obj === undefined || obj === null) {
      this.value = null;
    } else {
      this.value = obj;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {}
}
