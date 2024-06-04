import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
    <hr class="my-4 border-gray-300" />
    <div class="flex flex-col justify-between items-start">
      <div class="flex items-center py-2.5">
        <h2 class="text-sm">Dont missout on once-in-a-while-deals:</h2>
        <div class="flex space-x-2 ml-2">
          <button class="rounded-md shadow-md shadow-zinc-400">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="32"
                height="32"
                rx="8"
                fill="black"
                fill-opacity="0.04"
              />
              <path
                d="M23.3333 9.99999C22.6949 10.4503 21.988 10.7947 21.24 11.02C20.8385 10.5583 20.3048 10.2311 19.7113 10.0826C19.1178 9.9341 18.493 9.97145 17.9213 10.1896C17.3497 10.4078 16.8589 10.7963 16.5153 11.3025C16.1716 11.8087 15.9918 12.4082 16 13.02V13.6867C14.8284 13.717 13.6675 13.4572 12.6206 12.9303C11.5738 12.4034 10.6735 11.6257 9.99996 10.6667C9.99996 10.6667 7.33329 16.6667 13.3333 19.3333C11.9603 20.2653 10.3247 20.7326 8.66663 20.6667C14.6666 24 22 20.6667 22 13C21.9993 12.8143 21.9815 12.6291 21.9466 12.4467C22.627 11.7757 23.1072 10.9285 23.3333 9.99999V9.99999Z"
                stroke="#EF233C"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <button class="rounded-md shadow-md shadow-zinc-400">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="32"
                height="32"
                rx="8"
                fill="black"
                fill-opacity="0.04"
              />
              <path
                d="M20 9.33337H18C17.1159 9.33337 16.2681 9.68456 15.6429 10.3097C15.0178 10.9348 14.6666 11.7827 14.6666 12.6667V14.6667H12.6666V17.3334H14.6666V22.6667H17.3333V17.3334H19.3333L20 14.6667H17.3333V12.6667C17.3333 12.4899 17.4035 12.3203 17.5286 12.1953C17.6536 12.0703 17.8231 12 18 12H20V9.33337Z"
                stroke="#EF233C"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <button class="rounded-md shadow-md shadow-zinc-400">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="32"
                height="32"
                rx="8"
                fill="black"
                fill-opacity="0.04"
              />
              <g clip-path="url(#clip0_58_33)">
                <path
                  d="M19.3334 9.33337H12.6667C10.8258 9.33337 9.33337 10.8258 9.33337 12.6667V19.3334C9.33337 21.1743 10.8258 22.6667 12.6667 22.6667H19.3334C21.1743 22.6667 22.6667 21.1743 22.6667 19.3334V12.6667C22.6667 10.8258 21.1743 9.33337 19.3334 9.33337Z"
                  stroke="#EF233C"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M18.6667 15.58C18.7489 16.1348 18.6542 16.7014 18.3958 17.1993C18.1375 17.6972 17.7288 18.1009 17.2278 18.3531C16.7267 18.6052 16.159 18.693 15.6052 18.6039C15.0514 18.5148 14.5398 18.2533 14.1432 17.8567C13.7466 17.4601 13.4852 16.9485 13.3961 16.3948C13.3069 15.841 13.3947 15.2732 13.6469 14.7722C13.8991 14.2712 14.3028 13.8625 14.8007 13.6041C15.2985 13.3458 15.8652 13.251 16.42 13.3333C16.986 13.4172 17.5099 13.6809 17.9145 14.0855C18.319 14.4901 18.5827 15.014 18.6667 15.58Z"
                  stroke="#EF233C"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M19.6666 12.3334H19.6766"
                  stroke="#EF233C"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_58_33">
                  <rect
                    width="16"
                    height="16"
                    fill="white"
                    transform="translate(8 8)"
                  />
                </clipPath>
              </defs>
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div class="flex justify-between items-center">
      <h2 class="text-sm">Support line: 1-800-000-0000</h2>
      <h2 class="text-sm">Copyright 2024 © Sneaker ltd</h2>
    </div>
  `,
})
export class FooterComponent {}
