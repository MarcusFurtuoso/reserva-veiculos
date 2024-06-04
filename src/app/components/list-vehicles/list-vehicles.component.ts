import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { forkJoin, map, mergeMap, of } from 'rxjs';
import { Vehicle } from '../../models/forms/vehicle.model';
import { CartReserveService } from '../../service/cart-reserve.service';
import { VeiculoService } from '../../service/veiculo.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'list-car',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  template: `
    <div class="min-h-96 space-y-3 px-4">
      <div class="flex justify-between items-center mb-10">
        <h1 class="text-3xl font-bold">Available Vehicles</h1>
        <div class="flex gap-4">
          <div class="relative">
            <!-- <button class="absolute left-2 -translate-y-1/2 top-1/2 p-1">
              <fa-icon icon="magnifying-glass" class="text-zinc-700" />
            </button>
            <input
              class="rounded-md px-8 py-3 border-2 border-transparent focus:outline-none focus:border-[#ff754b] placeholder-gray-400 transition-transform duration-300 shadow-md"
              placeholder="Search..."
              required="true"
              type="text"
            />
            <button
              type="reset"
              class="absolute right-3 -translate-y-1/2 top-1/2 p-1"
            >
              <fa-icon icon="xmark" class="text-zinc-700" />
            </button> -->
          </div>
        </div>
      </div>
      @for (vehicle of vehicles; track $index) {
      <div class="shadow-md rounded-md p-4 flex justify-between items-center">
        <div class="flex gap-5">
          @if (vehicle.image) {
          <img
            [src]="vehicle.image"
            class="w-64 h-40 object-cover cursor-pointer transform transition-all duration-200 hover:scale-110"
            [title]="vehicle.nome"
          />
          } @else {
          <img
            src="assets/imgs/image-not-available.png"
            class="w-60 h-auto object-cover cursor-pointer transform transition-all duration-200 hover:scale-110"
            [title]="vehicle.nome"
          />
          }
          <div class="flex flex-col w-96">
            <p class="font-bold text-xl mb-1">{{ vehicle.nome }}</p>
            <p class="font-semibold text-sm mb-1">
              {{ vehicle.marca }}
            </p>
            <p class="text-justify">
              {{ vehicle.descricao!.length >= 150 ? (vehicle.descricao | slice:0:150) + '...' : vehicle.descricao }}</p>

            <p class="text-[#ED5A2F] mt-3 font-semibold text-2xl">
              {{ vehicle.preco | currency : 'BRL' }}
            </p>
          </div>
        </div>

        <div class="flex items-center">
          <button
            (click)="addVehicleInCart(vehicle)"
            type="submit"
            class="bg-[#ED5A2F] rounded-md px-6 py-1.5 text-black font-medium hover:bg-[#ff754b] transition duration-300 ease-in-out"
          >
            Reserve
            <fa-icon icon="add" class=" pl-2 text-black" />
          </button>
        </div>
      </div>
      }
    </div>
  `,
})
export class ListVehiclesComponent implements OnInit {
  vehicles: Vehicle[] = [];

  readonly #activeRoute = inject(ActivatedRoute);
  readonly #vehicleService = inject(VeiculoService);
  protected readonly cartService = inject(CartReserveService);

  ngOnInit() {
    this.#activeRoute.params.subscribe(params => {
      const type = params['type'];
      switch(type) {
        case 'cars':
          this.listAllCars();
          break;
        case 'motorcycles':
          this.listAllMotorcycles();
          break;
        case 'trucks':
          this.listAllTrucks();
          break;
        default:
          this.listAllVehicles();
      }
    });
  }

  listAllVehicles() {
    this.#vehicleService
      .getAllVehicles()
      .pipe(
        mergeMap((vehicles: Vehicle[]) => {
          if (vehicles.length > 0) {
            let vehicleImagesRequests = vehicles.map((vehicle) =>
              this.#vehicleService.getVehicleImages(vehicle.id!).pipe(
                map((vehicleImagesDto) => {
                  if (vehicleImagesDto && vehicleImagesDto[0]) {
                    vehicle.image = vehicleImagesDto[0].bytes; // Access the 'bytes' property correctly
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
        },
        error: (error: Error) => {
          console.error('Error: ' + error);
        },
      });
  }

  listAllCars() {
    this.#vehicleService.getAllCars().pipe(
      mergeMap((vehicles: Vehicle[]) => {
        if (vehicles.length > 0) {
          let vehicleImagesRequests = vehicles.map((vehicle) =>
            this.#vehicleService.getVehicleImages(vehicle.id!).pipe(
              map((vehicleImagesDto) => {
                if (vehicleImagesDto && vehicleImagesDto[0]) {
                  vehicle.image = vehicleImagesDto[0].bytes; // Access the 'bytes' property correctly
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
    ).subscribe({
      next: (vehicles: Vehicle[]) => {
        this.vehicles = vehicles;
      },
      error: (error: Error) => {
        console.error('Error: ' + error);
      },
    });
  }

  listAllMotorcycles() {
    this.#vehicleService.getAllMotorcycles().pipe(
      mergeMap((vehicles: Vehicle[]) => {
        if (vehicles.length > 0) {
          let vehicleImagesRequests = vehicles.map((vehicle) =>
            this.#vehicleService.getVehicleImages(vehicle.id!).pipe(
              map((vehicleImagesDto) => {
                if (vehicleImagesDto && vehicleImagesDto[0]) {
                  vehicle.image = vehicleImagesDto[0].bytes; // Access the 'bytes' property correctly
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
    ).subscribe({
      next: (vehicles: Vehicle[]) => {
        this.vehicles = vehicles;
      },
      error: (error: Error) => {
        console.error('Error: ' + error);
      },
    });
  }

  listAllTrucks() {
    this.#vehicleService.getAllTrucks().pipe(
      mergeMap((vehicles: Vehicle[]) => {
        if (vehicles.length > 0) {
          let vehicleImagesRequests = vehicles.map((vehicle) =>
            this.#vehicleService.getVehicleImages(vehicle.id!).pipe(
              map((vehicleImagesDto) => {
                if (vehicleImagesDto && vehicleImagesDto[0]) {
                  vehicle.image = vehicleImagesDto[0].bytes; // Access the 'bytes' property correctly
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
    ).subscribe({
      next: (vehicles: Vehicle[]) => {
        this.vehicles = vehicles;
      },
      error: (error: Error) => {
        console.error('Error: ' + error);
      },
    });
  }

  addVehicleInCart(vehicle: Vehicle) {
    this.cartService.addVehicleToCart(vehicle);
  }
}
