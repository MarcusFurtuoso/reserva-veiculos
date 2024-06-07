import { CommonModule } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { forkJoin, map, mergeMap, of } from 'rxjs';
import { Vehicle } from '../../models/forms/vehicle.model';
import { AlertService } from '../../service/alert.service';
import { VeiculoService } from '../../service/veiculo.service';
import { DialogComponent } from '../dialog/dialog.component';
import { LoadingService } from '../../service/loading.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { PaginationResponse } from '../../models/dtos/pagination-dto';

@Component({
  selector: 'app-admin-user-profile',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FontAwesomeModule,
    NgxPaginationModule,
    DialogComponent,
    FormsModule,
  ],
  template: `
    <div class="min-h-96 space-y-6 px-4 pb-8">
      <div class="flex justify-between items-center mb-12">
        <h1 class="text-3xl font-bold">All Vehicles</h1>
        <div class="flex gap-4">
          <div class="relative">
            <button class="absolute left-2 -translate-y-1/2 top-1/2 p-1">
              <fa-icon
                (click)="listAllVehiclesBySearch(search)"
                icon="magnifying-glass"
                class="text-zinc-700"
              />
            </button>
            <input
              class="rounded-md px-8 py-3 border-2 border-transparent focus:outline-none focus:border-[#ff754b] placeholder-gray-400 transition-transform duration-300 shadow-md"
              placeholder="Search..."
              required="true"
              type="text"
              [(ngModel)]="search"
              (keyup.enter)="listAllVehiclesBySearch(search)"
              (keyup)="search === '' ? listAllVehiclesPaginated() : null"
            />
            <button
              type="reset"
              class="absolute right-3 -translate-y-1/2 top-1/2 p-1"
            >
              <fa-icon
                (click)="resetSearch()"
                icon="xmark"
                class="text-zinc-700"
              />
            </button>
          </div>
          <div
            class="flex ml-2 items-center relative"
            (click)="toggleDropdown()"
          >
            <button class="border border-[#ED5A2F] px-2 py-2 rounded-md">
              <svg viewBox="0 0 512 512" height="1em">
                <path
                  d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z"
                ></path>
              </svg>
            </button>
            <div
              class="flex w-[6.5rem] flex-col absolute top-10 -left-8 bg-slatext-white border border-[#ED5A2F] bg-white rounded-md  px-2 py-2"
              [ngStyle]="{ display: dropdownOpen ? 'block' : 'none' }"
            >
              <div
                (click)="listAllVehiclesPaginated()"
                class="hover:bg-[#ff754b] pb-1 px-1 w-full cursor-pointer rounded-md"
              >
                <p class="text-sm">All</p>
              </div>
              <div
                (click)="listAllVehiclesPaginated('CARRO')"
                class="hover:bg-[#ff754b] pb-1 px-1 w-full cursor-pointer rounded-md"
              >
                <p class="text-sm">Cars</p>
              </div>
              <div
                (click)="listAllVehiclesPaginated('MOTO')"
                class="hover:bg-[#ff754b] pb-1 px-1 w-[5.8rem] cursor-pointer rounded-md"
              >
                <p class="text-sm">Motorcycles</p>
              </div>
              <div
                (click)="listAllVehiclesPaginated('CAMINHAO')"
                class="hover:bg-[#ff754b] px-1 w-full cursor-pointer rounded-md"
              >
                <p class="text-sm">Trucks</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-start">
        <div class="flex gap-4">
          <button
            type="button"
            (click)="navigateToAddVehicle()"
            class="bg-[#ED5A2F] rounded-md px-6 py-1.5 text-white font-medium hover:bg-[#ff754b] transition duration-300 ease-in-out"
          >
            Add Vehicle
            <fa-icon icon="plus" class="pl-2 text-white" />
          </button>
        </div>
      </div>
      @for (vehicle of vehicles | paginate: { itemsPerPage: itemsPerPage,
      currentPage: currentPage, totalItems: totalItems}; track vehicle ; let i =
      $index) {
      <div class="shadow-md rounded-md p-4 flex justify-between items-center">
        <div class="flex gap-5">
          @if (vehicle.images && vehicle.images.length > 0) {
          <div class="max-w-64">
            <swiper-container
              pagination="true"
              pagination-dynamic-bullets="true"
            >
              @for (imagem of vehicle.images; track imagem; let i = $index) {
              <swiper-slide>
                <img
                  [src]="imagem"
                  alt="Vehicle Image"
                  class="max-w-64 max-h-40 object-cover cursor-pointer transform transition-all duration-200 hover:scale-105"
                />
              </swiper-slide>
              }
            </swiper-container>
          </div>
          } @else {
          <div class="max-w-64">
            <img
              src="assets/imgs/car-illustration.png"
              class="w-64 max-h-40 object-cover cursor-pointer transform transition-all duration-200 hover:scale-105"
              title="Image not avaliable"
            />
          </div>
          }
          <div class="flex flex-col w-96">
            <p class="font-bold text-xl mb-1 ">{{ vehicle.nome }}</p>
            <p class="font-semibold text-sm mb-1">
              {{ vehicle.marca }}
            </p>
            <p class="text-justify">
              {{
                vehicle.descricao!.length >= 150
                  ? (vehicle.descricao | slice : 0 : 150) + '...'
                  : vehicle.descricao
              }}
            </p>

            <p class="text-[#ED5A2F] mt-3 font-semibold text-2xl">
              {{ vehicle.preco | currency : 'BRL' }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            (click)="navigateToUpdateVehicle(vehicle)"
            type="button"
            class="bg-[#ED5A2F] rounded-md px-6 py-1.5 text-white font-medium hover:bg-[#ff754b] transition duration-300 ease-in-out"
          >
            Edit
            <fa-icon icon="edit" class=" pl-2 text-white" />
          </button>

          <button
            (click)="show(vehicle.id!)"
            type="button"
            class="bg-red-600 rounded-md px-6 py-1.5 text-white font-medium hover:bg-red-500 transition duration-300 ease-in-out"
          >
            Delete
            <fa-icon icon="trash" class="pl-2 text-white" />
          </button>
        </div>
        <dialog
          [style.display]="isDialogOpen ? 'block' : 'none'"
          class="rounded-2xl bg-transparent backdrop:bg-black/50 fixed inset-0 z-50"
          #dialogRef
        >
          <div
            class="group select-none w-[20rem] flex flex-col p-4 relative items-center bg-zinc-800 border border-zinc-800 shadow-lg rounded-2xl"
          >
            <div class="">
              <div class="text-center p-3 flex-auto justify-center">
                <svg
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  class="group-hover:animate-bounce w-12 h-12 flex items-center text-gray-600 fill-red-500 mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clip-rule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    fill-rule="evenodd"
                  ></path>
                </svg>
                <h2 class="text-xl font-bold py-4 text-gray-200">
                  Are you sure?
                </h2>
                <p class="font-bold text-sm text-gray-500 px-2">
                  Do you really want to exclude this vehicle? This process
                  cannot be undone
                </p>
              </div>
              <div class="p-2 mt-2 text-center space-x-2 md:block">
                <button
                  type="button"
                  (click)="close()"
                  class="mb-2 md:mb-0 bg-gray-700 px-5 py-2 text-sm shadow-sm font-medium tracking-wider border-2 border-gray-600 hover:border-gray-700 text-gray-300 rounded-full hover:shadow-lg hover:bg-gray-800 transition ease-in duration-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  (click)="deleteVehicle()"
                  class="bg-red-600 hover:bg-transparent px-5 ml-4 py-2 text-sm shadow-sm hover:shadow-lg font-medium tracking-wider border-2 border-red-600 hover:border-red-600 text-white hover:text-red-600 rounded-full transition ease-in duration-300"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </dialog>
      </div>
      }
    </div>
    <div class="flex justify-center">
      <pagination-controls
        class="ngx-pagination"
        previousLabel="Previous"
        nextLabel="Next"
        (pageChange)="onPageChange($event)"
      ></pagination-controls>
    </div>
  `,
  styleUrls: ['./admin-vehicles.component.css'],
})
export class AdminVehiclesComponent implements OnInit {
  itemsPerPage: number = 9;
  currentPage: number = 0;
  totalItems: number = 0;

  isDialogOpen = false;
  dropdownOpen = false;

  deleteIndex!: number;

  search: string = '';

  vehicles: Vehicle[] = [];

  readonly #router = inject(Router);
  readonly #alertService = inject(AlertService);
  readonly #vehicleService = inject(VeiculoService);
  readonly #loadingService = inject(LoadingService);

  @ViewChild('dialogRef') dialogRef!: ElementRef<HTMLDialogElement>;

  ngOnInit(): void {
    this.listAllVehiclesPaginated();
  }

  protected listAllVehiclesPaginated(filter?: string | null) {
    if (filter) {
      this.currentPage = 1;
    }

    this.#vehicleService
      .getAllVehiclesPaginated(this.currentPage - 1, this.itemsPerPage, filter?.toString())
      .pipe(
        mergeMap((response: PaginationResponse<Vehicle>) => {
          // console.log(response);

          this.totalItems = response.totalElements;
          let vehicles: Vehicle[] = response.content;
          if (vehicles.length > 0) {
            let vehicleImagesRequests = vehicles.map((vehicle) =>
              this.#vehicleService.getVehicleImages(vehicle.id!).pipe(
                map((vehicleImagesDto) => {
                  if (vehicleImagesDto && vehicleImagesDto) {
                    vehicle.images = vehicleImagesDto.map(
                      (image) => image.bytes
                    );
                  }
                  return vehicle;
                })
              )
            );
            return forkJoin(vehicleImagesRequests);
          } else {
            return of([]);
          }
        })
      )
      .subscribe({
        next: (vehicles: Vehicle[]) => {
          this.vehicles = vehicles;
          console.log(vehicles);
        },
        error: (error: Error) => {
          console.error('Error: ' + error);
        },
      });
  }

  protected listAllVehiclesBySearch(search: string) {
    this.currentPage = 1;
    this.#vehicleService
      .getAllVehiclesBySearch(this.currentPage - 1, this.itemsPerPage, search)
      .pipe(
        mergeMap((response: any) => {
          this.totalItems = response.totalElements;
          let vehicles: Vehicle[] = response.content;
          if (vehicles.length > 0) {
            let vehicleImagesRequests = vehicles.map((vehicle) =>
              this.#vehicleService.getVehicleImages(vehicle.id!).pipe(
                map((vehicleImagesDto) => {
                  if (vehicleImagesDto && vehicleImagesDto) {
                    vehicle.images = vehicleImagesDto.map(
                      (image) => image.bytes
                    );
                  }
                  return vehicle;
                })
              )
            );
            return forkJoin(vehicleImagesRequests);
          } else {
            return of([]);
          }
        })
      )
      .subscribe({
        next: (vehicles: Vehicle[]) => {
          this.vehicles = vehicles;
          // console.log(vehicles);
        },
        error: (error: Error) => {
          console.error('Error: ' + error);
        },
      });
  }

  protected deleteVehicle() {
    this.#loadingService.isLoading.next(true);
    this.isDialogOpen = true;
    this.#vehicleService.delete(this.deleteIndex).subscribe({
      next: () => {
        setTimeout(() => {
          this.#loadingService.isLoading.next(false);
          this.#alertService.success('Vehicle deleted successfully!');
          this.currentPage = 1;
          this.listAllVehiclesPaginated();
        }, 300);
        this.close();
      },
      error: (error: any) => {
        console.error(error);
        this.#alertService.error('Error deleting vehicle!');
      },
    });
  }

  protected resetSearch() {
    this.search = '';
    this.listAllVehiclesPaginated();
  }

  protected toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  protected onPageChange(page: number) {
    this.currentPage = page;
    this.listAllVehiclesPaginated();
  }

  protected show(vehicleId: number) {
    this.deleteIndex = vehicleId;
    this.isDialogOpen = true;
    this.dialogRef.nativeElement.showModal();
  }

  protected close() {
    this.isDialogOpen = false;
    this.dialogRef.nativeElement.close();
  }

  protected navigateToAddVehicle() {
    this.#router.navigate(['admin', 'add-vehicle']);
  }

  protected navigateToUpdateVehicle(vehicle: Vehicle) {
    this.#router.navigate(['admin', 'update-vehicle', vehicle.id]);
  }
}
