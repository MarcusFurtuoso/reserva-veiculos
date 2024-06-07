import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IReserveUsuarioListResponse } from '../../models/dtos/reserve-usuario-list';
import { UserAuthResponse } from '../../models/dtos/token-payload';
import { IVehicleResponse } from '../../models/dtos/vehicle-dto';
import { IVehicleImagesResponse } from '../../models/dtos/vehicle-images-dto';
import { AuthService } from '../../service/auth.service';
import { ReservaService } from '../../service/reserva.service';
import { VeiculoService } from '../../service/veiculo.service';
import { PdfService } from '../../service/pdf.service';
import { InputComponent } from '../input/input.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reserve-pdf',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, InputComponent, FormsModule],
  template: `
    <div class="flex justify-end bg-gray-50 px-56 gap-2">
      <div>
        <button
          type="button"
          (click)="navigateToReserves()"
          class="mt-6 px-4 py-2 rounded-md font-medium bg-[#ED5A2F] text-zinc-950 hover:bg-[#ff754b] transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ED5A2F]"
        >
          Back
          <fa-icon icon="arrow-left" class="pl-2 text-black" />
        </button>
      </div>

      <div>
        <button
          (click)="generatePDF()"
          class="mt-6 px-4 py-2 rounded-md font-medium bg-[#ED5A2F] text-zinc-950 hover:bg-[#ff754b] transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ED5A2F] focus:ring-offset-white"
          type="submit"
        >
          Print
          <fa-icon icon="print" class="pl-2 text-black" />
        </button>
      </div>
    </div>

    <div
      class="min-h-screen flex flex-col justify-center items-center bg-gray-50"
      id="reservePdf"
    >
      <div class="w-2/3 mt-10 rounded-md shadow-2xl bg-white pb-8 mb-4">
        <div class="px-6">
          @if (images.length > 0) {
          <div class="flex justify-center items-center py-4">
              @for (vehicleImage of images; track vehicleImage) {
                <img
                src="{{ vehicleImage.bytes }}"
                title="Image not avaliable"
                class="max-w-64 max-h-40 object-cover cursor-pointer transform transition-all duration-200 hover:scale-105"
                />
              }
            </div>
          }
          <div class="flex flex-col gap-4">
            <h1 class="text-2xl text-start font-bold mt-4">Vehicle Details:</h1>

            <div class="grid grid-cols-4 gap-x-5 gap-y-8">
              <div class="">
                <label class="font-medium text-zinc-950">Name</label>
                <p
                  class="border border-gray-300 rounded-md w-full mt-2 px-3 py-3.5 text-start bg-white text-gray-900"
                  type="text"
                >
                  {{ vehicle?.nome }}
                </p>
              </div>

              <div class="">
                <label class="font-medium text-zinc-950">Price</label>
                <p
                  class="border border-gray-300 rounded-md w-full mt-2 px-3 py-3.5 text-start bg-white text-gray-900"
                >
                  {{ vehicle?.preco }}
                </p>
              </div>

              <div class="">
                <label class="font-medium text-zinc-950">Brand</label>
                <p
                  class="border border-gray-300 rounded-md w-full mt-2 px-3 py-3.5 text-start bg-white text-gray-900"
                >
                  {{ vehicle?.marca }}
                </p>
              </div>

              <div>
                <label class="font-medium text-zinc-950" for="tipo">Type</label>
                <p
                  class="border border-gray-300 rounded-md w-full mt-2 px-3 py-3.5 text-start bg-white text-gray-900"
                >
                  {{ vehicle?.tipo }}
                </p>
              </div>

              <div class="col-span-4">
                <label
                  class="block font-medium leading-6 text-zinc-950"
                  for="descricao"
                  >Description</label
                >
                <p
                  class="border border-gray-300 rounded-md w-full mt-2 px-3 py-3.5 text-start bg-white text-gray-900"
                >
                  {{ vehicle?.descricao }}
                </p>
              </div>
            </div>

            <h1 class="text-2xl text-start font-bold mt-4">Reserve Details:</h1>

            <div>
              <div class="grid grid-cols-4 gap-x-5 gap-y-8">
                <div class="">
                  <label
                    class="block font-medium leading-6 text-zinc-950"
                    for="dataInicio"
                    >Start Date</label
                  >
                  <p
                    class="border border-gray-300 rounded-md w-full mt-2 px-3 py-3.5 text-start bg-white text-gray-900"
                  >
                    {{ reserve?.dataInicial }}
                  </p>
                </div>

                <div class="">
                  <label
                    class="block font-medium leading-6 text-zinc-950"
                    for="dataFim"
                    >End Date</label
                  >
                  <p
                    class="border border-gray-300 rounded-md w-full mt-2 px-3 py-3.5 text-start bg-white text-gray-900"
                  >
                    {{ reserve?.dataFinal }}
                  </p>
                </div>

                <div class="">
                  <label
                    class="block font-medium leading-6 text-zinc-950"
                    for="valorTotal"
                    >Total Value</label
                  >
                  <p
                    class="border border-gray-300 rounded-md w-full mt-2 px-3 py-3.5 text-start bg-white text-gray-900"
                  >
                    {{ vehicle?.preco }}
                  </p>
                </div>

                <div class="">
                  <label
                    class="block font-medium leading-6 text-zinc-950"
                    for="status"
                    >Status</label
                  >
                  <p
                    class="border border-gray-300 rounded-md w-full mt-2 px-3 py-3.5 text-start bg-white text-gray-900"
                  >
                    {{ reserveStatus }}
                  </p>
                </div>
              </div>
            </div>

            <h1 class="text-2xl text-start font-bold mt-4">User Details:</h1>
            <div>
              <div class="grid grid-cols-2 gap-x-5 gap-y-8">
                <div class="">
                  <label
                    class="block font-medium leading-6 text-zinc-950"
                    for="nome"
                    >Name</label
                  >
                  <p
                    class="border border-gray-300 rounded-md w-full mt-2 px-3 py-3.5 text-start bg-white text-gray-900"
                  >
                    {{ user?.nome }}
                  </p>
                </div>

                <div class="">
                  <label
                    class="block font-medium leading-6 text-zinc-950"
                    for="email"
                    >Email</label
                  >
                  <p
                    class="border border-gray-300 rounded-md w-full mt-2 px-3 py-3.5 text-start bg-white text-gray-900"
                  >
                    {{ user?.login }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ReservePdfComponent implements OnInit {
  #activatedRoute = inject(ActivatedRoute);
  #vehicleService = inject(VeiculoService);
  #reservaService = inject(ReservaService);
  #usuarioService = inject(AuthService);
  #pdfService = inject(PdfService);
  #router = inject(Router);

  vehicle?: IVehicleResponse;
  reserve?: IReserveUsuarioListResponse;
  user?: UserAuthResponse;

  reserveStatus = 'RESERVED';

  images: IVehicleImagesResponse[] = [];

  ngOnInit(): void {
    this.#activatedRoute.params.subscribe((params) => {
      if (params['reserveId']) {
        this.#reservaService.findById(params['reserveId']).subscribe({
          next: (response) => {
            this.reserve = response;
            console.log('RESERVE' + this.reserve);

            this.#vehicleService.findById(this.reserve.veiculoId).subscribe({
              next: (vehicle) => {
                this.vehicle = vehicle;
                console.log('VEHICLE' + this.vehicle);
              },
              error: (error) => {
                console.log(error);
              },
            });

            this.#vehicleService
              .getVehicleImages(this.reserve.veiculoId)
              .subscribe({
                next: (response) => {
                  this.images = response ?? [];
                  console.log('IMAGES' + this.images.length);
                },
                error: (error) => {
                  console.log(error);
                },
              });

            this.#usuarioService.loggedUser.subscribe({
              next: (user) => {
                this.user = user?.user;
                console.log('USER' + this.user);
              },
              error: (error) => {
                console.log(error);
              },
            });
          },
          error: (error) => {
            console.log(error);
          },
        });
      }
    });
  }

  generatePDF() {
    this.#pdfService.generatePDF('reservePdf');
  }

  navigateToReserves() {
    this.#router.navigate(['home', 'reservations']);
  }
}
