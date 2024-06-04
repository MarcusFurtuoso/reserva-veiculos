import { CommonModule } from '@angular/common';
import {
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

@Component({
  selector: 'app-admin-user-profile',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, DialogComponent],
  template: `
    <div class="min-h-96 space-y-3 px-4">
      <div class="flex justify-between mb-10">
        <h1 class="text-3xl font-bold">All Vehicles</h1>
        <div class="flex gap-4">
          <button
            type="submit"
            (click)="navigateToAddVehicle()"
            class="bg-[#ED5A2F] rounded-md px-6 py-1.5 text-white font-medium hover:bg-[#ff754b] transition duration-300 ease-in-out"
          >
            Add Vehicle
            <fa-icon icon="plus" class="pl-2 text-white" />
          </button>

          <div class="flex ml-2 items-center relative" (click)="toggleDropdown()">
            <button class="border border-[#ED5A2F] px-2 py-2 rounded-md">
              <svg viewBox="0 0 512 512" height="1em">
                <path
                  d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z"
                ></path>
              </svg>
            </button>
            <div
              class="flex w-[6.5rem] flex-col absolute top-10 -left-8 bg-slatext-white border border-[#ED5A2F] rounded-md  px-2 py-2"
              [ngStyle]="{ display: dropdownOpen ? 'block' : 'none' }"
            >
            <div (click)="listAllVehicles()" class="hover:bg-[#ff754b] pb-1 px-1 w-full cursor-pointer rounded-md">
              <p class="text-sm">All</p>
            </div>
            <div (click)="listAllCars()"  class="hover:bg-[#ff754b] pb-1 px-1 w-full cursor-pointer rounded-md">
              <p class="text-sm">Cars</p>
            </div>
            <div (click)="listAllMotorcycles()" class="hover:bg-[#ff754b] pb-1 px-1 w-[5.8rem] cursor-pointer rounded-md">
              <p class="text-sm">Motorcycles</p>
            </div>
            <div (click)="listAllTrucks()" class="hover:bg-[#ff754b] px-1 w-full cursor-pointer rounded-md">
              <p class="text-sm">Trucks</p>
            </div>
            </div>
          </div>
        </div>
      </div>
      @for (vehicle of vehicles; track vehicle; let i = $index) {
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
            class="w-60 h-40 object-cover cursor-pointer transform transition-all duration-200 hover:scale-110"
            [title]="vehicle.nome"
          />
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
                  (click)="close()"
                  class="mb-2 md:mb-0 bg-gray-700 px-5 py-2 text-sm shadow-sm font-medium tracking-wider border-2 border-gray-600 hover:border-gray-700 text-gray-300 rounded-full hover:shadow-lg hover:bg-gray-800 transition ease-in duration-300"
                >
                  Cancel
                </button>
                <button
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
  `,
  styles: ``,
})
export class AdminVehiclesComponent implements OnInit {
  readonly #router = inject(Router);
  readonly #alertService = inject(AlertService);
  readonly #vehicleService = inject(VeiculoService);
  readonly #loadingService = inject(LoadingService);

  isDialogOpen = false;

  dropdownOpen = false;

  public deleteIndex!: number;

  @ViewChild('dialogRef') dialogRef!: ElementRef<HTMLDialogElement>;

  vehicles: Vehicle[] = [];

  ngOnInit(): void {
    this.listAllVehicles();
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  protected listAllVehicles() {
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
          console.error(error);
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


  deleteVehicle() {
    this.#loadingService.isLoading.next(true);
    this.isDialogOpen = true;
    this.#vehicleService.delete(this.deleteIndex).subscribe({
      next: () => {
        setTimeout(() => {
          this.#loadingService.isLoading.next(false);
          this.#alertService.success('Vehicle deleted successfully!');
          this.listAllVehicles();
        }, 300);
        this.close();
      },
      error: (error: any) => {
        console.error(error);
        this.#alertService.error('Error deleting vehicle!');
      },
    });
  }

  show(vehicleId: number) {
    this.deleteIndex = vehicleId;
    this.isDialogOpen = true;
    this.dialogRef.nativeElement.showModal();
  }

  close() {
    this.isDialogOpen = false;
    this.dialogRef.nativeElement.close();
  }

  navigateToAddVehicle() {
    this.#router.navigate(['admin', 'add-vehicle']);
  }

  navigateToUpdateVehicle(vehicle: Vehicle) {
    this.#router.navigate(['admin','update-vehicle', vehicle.id]);
  }
}
