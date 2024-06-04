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

@Component({
  selector: 'app-reserve-pdf',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
    <div class="flex justify-end bg-gray-50 px-44 gap-2">
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
    <div class="h-screen flex flex-col items-center bg-gray-50" id="reservePdf">
      <div class="w-3/4 mt-6">
        <div class="mt-4 px-10 py-6 rounded-md shadow-2xl bg-white">
          <h1 class="text-3xl text-center font-semibold">Reserve PDF</h1>
          <div class="flex justify-end mb-2"></div>

          <div class="space-y-3">
            <div
              class="shadow-md rounded-md border border-t-0 p-4 flex justify-between items-center"
            >
              <div class="flex gap-5">
                @if (images.length > 0) {
                <img
                  src="{{ images[0].bytes }}"
                  class="size-40 obj w-fit cursor-pointer transform transition-all duration-200 hover:scale-110 shadow-md"
                  title="{{ vehicle?.nome }}"
                />
                } @else {
                <img
                  src="assets/imgs/image-not-available.png"
                  class="size-40  obj w-fit cursor-pointer transform transition-all duration-200 hover:scale-110 shadow-md"
                  title="Not available image"
                />
                }
                <div class="flex flex-col gap-3">
                  <div>
                    <p class="font-bold text-lg pt-0.5">Reserve:</p>

                    <div class="px-4">
                      <p class="mt-1"><strong>Id:</strong> {{ reserve?.id }}</p>

                      <p class="mt-1">
                        <strong>Initial Date:</strong>
                        {{ reserve?.dataInicial }}
                      </p>
                      <p class="mt-1">
                        <strong>Final Date:</strong> {{ reserve?.dataFinal }}
                      </p>
                    </div>
                  </div>

                  <div class="">
                    <p class="font-bold text-lg pt-0.5">Vehicle: </p>

                    <div class="px-4">
                      <p class="mt-1">
                        <strong>Name:</strong> {{ vehicle?.nome }}
                      </p>
                      <p class="mt-1">
                        <strong>Brand:</strong> {{ vehicle?.marca }}
                      </p>
                      <p class="mt-1">
                        <strong>Description: </strong> {{ vehicle?.descricao }}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p class="font-bold text-lg pt-0.5">
                      User:
                    </p>
                    <div class="px-4">
                      <p class="mt-1">
                        <strong>Name: </strong> {{ user?.nome }}
                      </p>
                      <p class="mt-1">
                        <strong>Login: </strong> {{ user?.login }}
                      </p>
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    @media print {
      .no-print {
        display: none;
      }
    }
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
    this.#router.navigate(['home','reservations']);
  }
}
