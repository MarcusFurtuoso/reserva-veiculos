import { CommonModule } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { forkJoin, map, mergeMap, of } from 'rxjs';
import { Vehicle } from '../../models/forms/vehicle.model';
import { CartReserveService } from '../../service/cart-reserve.service';
import { VeiculoService } from '../../service/veiculo.service';
import { ActivatedRoute } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { VehicleTypeFilters } from '../../models/enums/vehicle-type-filter';
import { FormsModule } from '@angular/forms';
import { PaginationResponse } from '../../models/dtos/pagination-dto';

@Component({
  selector: 'list-car',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, FontAwesomeModule, NgxPaginationModule, FormsModule],
  template: `
    <div class="min-h-96 space-y-6 px-4 justify-between">
      <div class="flex justify-between items-center mb-10">
        <h1 class="text-3xl text-center font-bold">Available Vehicles</h1>

        <div class="flex gap-4">
          <div class="relative">
            <button class="absolute left-2 -translate-y-1/2 top-1/2 p-1">
              <fa-icon
              (click)="listAllVehiclesBySearch(search)"
              icon="magnifying-glass"
              class="text-zinc-700" />
            </button>
            <input
              class="rounded-md px-8 py-3 border-2 border-transparent focus:outline-none focus:border-[#ff754b] placeholder-gray-400 transition-transform duration-300 shadow-md"
              placeholder="Search..."
              required="true"
              type="text"
              [(ngModel)]="search"
              (keyup.enter)="listAllVehiclesBySearch(search)"
              (keyup)="search === '' ? listAllVehiclesPaginated(currentPage) : null"
            />
            <button
              type="reset"
              class="absolute right-3 -translate-y-1/2 top-1/2 p-1"
            >
              <fa-icon (click)="resetSearch()" icon="xmark" class="text-zinc-700" />
            </button>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-3 gap-x-6 gap-y-8">
        @for (vehicle of vehicles | paginate: { itemsPerPage: itemsPerPage,
        currentPage: currentPage, totalItems: totalItems}; track vehicle; let i
        = $index) {
        <div class="flex flex-col rounded-md shadow-md border-x-2">
          <div class="flex justify-center items-center">
          @if (vehicle.images && vehicle.images.length > 0) {
            <div class="max-w-80">
              <swiper-container
                pagination="true"
                pagination-dynamic-bullets="true"
              >
                @for (image of vehicle.images; track image; let i = $index) {
                <swiper-slide>
                  <img
                    [src]="image"
                    [title]="vehicle.nome"
                    alt="Vehicle Image"
                    class="max-w-80 max-h-40 object-cover cursor-pointer transform transition-all duration-200 hover:scale-105"
                  />
                </swiper-slide>
                }
              </swiper-container>
            </div>
          } @else {
            <div class="max-w-80">
            <img
              src="assets/imgs/car-illustration.png"
              title="Image not avaliable"
              class="max-w-80 max-h-40 object-cover cursor-pointer transform transition-all duration-200 hover:scale-105"
            />
            </div>
          }
          </div>
          <div class="flex flex-col px-3 py-3 border border-x-0 gap-y-0.5 mt-2">
            <p class="text-xs">2024/2025</p>
            <p class="text-lg font-bold">{{ vehicle.nome }}</p>
            <div class="flex justify-between mt-4 items-center">
              <p class="text-[#ED5A2F] font-bold">
                {{ vehicle.preco | currency : 'BRL' }}
              </p>
              <button
                class="px-5 py-1 bg-[#ED5A2F] rounded-md text-white font-medium hover:bg-[#ff754b] transition duration-300 ease-in-out"
                (click)="addVehicleInCart(vehicle)"
              >
                Reserve
              </button>
            </div>
          </div>
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
    </div>
  `,
  styleUrls: ['./list-vehicles.component.css'],
})
export class ListVehiclesComponent implements OnInit {

  vehicles: Vehicle[] = [];

  itemsPerPage: number = 9;
  currentPage: number = 0;
  totalItems: number = 0;

  search: string = '';

  readonly #activeRoute = inject(ActivatedRoute);
  readonly #vehicleService = inject(VeiculoService);
  protected readonly cartService = inject(CartReserveService);

  ngOnInit() {
    this.#activeRoute.params.subscribe((params) => {
      const type = params['type'];
      console.log(type);

      const filter = VehicleTypeFilters[type as keyof typeof VehicleTypeFilters];
      console.log(filter);

      this.currentPage = 1;

      this.listAllVehiclesPaginated(this.currentPage, filter);
    });
  }

  protected onPageChange(page: number) {
    this.currentPage = page;
    this.listAllVehiclesPaginated(this.currentPage);
  }

  protected listAllVehiclesPaginated(currentPage: number, filter?: string | null) {
    this.#vehicleService
      .getAllVehiclesPaginated(currentPage - 1, this.itemsPerPage, filter?.toString())
      .pipe(
        mergeMap((response: PaginationResponse<Vehicle>) => {
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
          console.log(vehicles);
        },
        error: (error: Error) => {
          console.error('Error: ' + error);
        },
      });
  }

  protected resetSearch() {
    this.search = '';
    this.listAllVehiclesPaginated(this.currentPage);
  }

  protected addVehicleInCart(vehicle: Vehicle) {
    this.cartService.addVehicleToCart(vehicle);
  }
}
