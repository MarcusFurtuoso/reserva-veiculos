import { CommonModule } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
  inject
} from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxPaginationModule } from 'ngx-pagination';
import { Subscription } from 'rxjs';
import { IReserveUsuarioListResponse } from '../../models/dtos/reserve-usuario-list';
import { ITokenPayload } from '../../models/dtos/token-payload';
import { IVehicleResponse } from '../../models/dtos/vehicle-dto';
import { AuthService } from '../../service/auth.service';
import { ReservaService } from '../../service/reserva.service';
import { ResourceNotFoundComponent } from '../resource-not-found/resource-not-found.component';

@Component({
  selector: 'app-list-reservation',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, ResourceNotFoundComponent, NgxPaginationModule],
  template: `
    <div class="min-h-96 space-y-6 px-4 pb-8">
      <h1 class="text-3xl font-bold pb-8">Reservations</h1>
      @if (reservas.length == 0) {
      <resource-not-found
        [svg]="svgString"
        title="No reservations found"
        message="You have not made any reservations yet. Click on the button below to return to the vehicle list and make a reservation."
      ></resource-not-found>
      }
      <div class="grid grid-cols-5 gap-x-5 gap-y-8">
        @for (reserva of reservas | paginate: { itemsPerPage: itemsPerPage,
        currentPage: currentPage, totalItems: totalItems} ; track reserva; let i = $index) {
        <div class="col-span-1">
          <label for="price">Reserve ID</label>
          <input
            class="border border-gray-500 px-5 py-2 rounded-md w-full"
            name="reserva"
            type="text"
            value="{{ reserva.id }}"
            disabled
          />
        </div>

        <div class="col-span-2">
          <label for="discount">Vehicle</label>
          <input
            id="vehicle"
            class="border border-gray-500 px-5 py-2 rounded-md w-full"
            name="vehicle"
            value="{{ reserva.veiculo }}"
            disabled
          />
        </div>

        <div class="col-span-1">
          <label for="category">Initial Date</label>
          <input
            id="date"
            class="border border-gray-500 px-5 py-2 rounded-md w-full"
            name="date"
            value="{{ reserva.dataInicial }}"
            disabled
          />
        </div>

        <div class="flex items-center col-span-1">
          <div class="mr-4">
            <label for="category">Final Date</label>
            <input
              id="date"
              class="border border-gray-500 px-5 py-2 rounded-md w-full"
              name="date"
              value="{{ reserva.dataFinal }}"
              disabled
            />
          </div>

          <div class="pt-5">
            <svg
              (click)="navigateToReservePdf(reserva.id)"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#EB6136"
              class="w-6 h-6 cursor-pointer"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z"
              />
            </svg>
          </div>
        </div>
        }
      </div>
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
  styleUrls: ['./list-reservation.component.css'],
})
export class ListReservationComponent implements OnInit, OnDestroy {
  #router = inject(Router);
  #reservaService = inject(ReservaService);
  #authService = inject(AuthService);

  svgString = `
  <svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  stroke-width="1.5"
  stroke="currentColor"
  class="w-64 h-64 mb-5"
>
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
  />
</svg>
`;

  usuario?: ITokenPayload;
  vehicle?: IVehicleResponse;
  reservas: IReserveUsuarioListResponse[] = [];

  itemsPerPage: number = 5;
  currentPage: number = 0;
  totalItems: number = 0;

  sub?: Subscription;

  ngOnInit(): void {
    this.getUsuario();

    this.listAllReservationsUserPaginated();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  listAllReservationsUserPaginated() {
    this.#reservaService.listAllByUsuarioPaginated(this.currentPage-1, this.itemsPerPage, this.usuario?.user.id!).subscribe({
      next: (response: any) => {
        this.totalItems = response.totalElements;
        this.reservas = response.content;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  protected onPageChange(page: number) {
    this.currentPage = page;
    this.listAllReservationsUserPaginated();
  }

  private getUsuario() {
    this.sub = this.#authService.getUsuarioLogged().subscribe({
      next: (response) => {
        this.usuario = response!;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  navigateToReservePdf(reserveId: number) {
    this.#router.navigate(['reserve-pdf', reserveId]);
  }
}
