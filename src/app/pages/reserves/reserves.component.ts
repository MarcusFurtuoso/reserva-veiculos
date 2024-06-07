import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Subscription, forkJoin } from 'rxjs';
import { ReserveListView } from '../../models/dtos/reserve-list-view';
import { UserAuthResponse } from '../../models/dtos/token-payload';
import { Reserve } from '../../models/forms/reserve.model';
import { AlertService } from '../../service/alert.service';
import { AuthService } from '../../service/auth.service';
import { CartReserveService } from '../../service/cart-reserve.service';
import { LoadingService } from '../../service/loading.service';
import { ReservaService } from '../../service/reserva.service';
import { ResourceNotFoundComponent } from '../../components/resource-not-found/resource-not-found.component';

@Component({
  selector: 'app-reserves',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FormsModule, ResourceNotFoundComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './reserves.component.html',
  styleUrl: './reserves.component.scss',
})
export class ReservesComponent implements OnInit, OnDestroy {


  #router = inject(Router);
  #reservaService = inject(ReservaService);
  #alertService = inject(AlertService);
  #loadingService = inject(LoadingService);
  #authService = inject(AuthService);
  protected cartReserveService = inject(CartReserveService);

  isDialogOpen = false;

  @ViewChild('dialogRef') dialogRef!: ElementRef<HTMLDialogElement>;

  reserveListView: ReserveListView[] = [];

  sub?: Subscription;
  usuario?: UserAuthResponse;

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

  public deleteIndex!: number;

  ngOnInit() {
    this.getUsuario();
    this.getAllReservas();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onSubmit() {
    this.#loadingService.isLoading.next(true);
    const requests = this.reserveListView.map((r) => {
      const reserve = new Reserve();
      reserve.dataInicial = r.dataInicial;
      reserve.dataFinal = r.dataFinal;
      reserve.veiculoId = r.veiculoId;
      reserve.usuarioId = r.usuarioId;
      return this.#reservaService.save(reserve);
    });
    forkJoin(requests).subscribe({
      next: () => {
        setTimeout(() => {
          this.#loadingService.isLoading.next(false);
          this.cartReserveService.clearCart();
          this.#alertService.success('Reservation successful!');
          this.navigateToVehicles();
        }, 500);
      },
      error: (error) => {
        console.error(error);
        setTimeout(() => {
          this.#loadingService.isLoading.next(false);
          this.#alertService.error('Error when making reservation.');
        }, 500);
      }
    }
    );
  }

  private getUsuario() {
    this.sub = this.#authService.getUsuarioLogged().subscribe({
      next: (response) => {
        this.usuario = response?.user;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  private getAllReservas() {
    this.cartReserveService.getVehiclesInCart().subscribe(() => {
      this.reserveListView = this.cartReserveService.getCart().map((vehicle) => {
        return {
          vehicleName: vehicle.nome,
          vehicleMarca: vehicle.marca,
          vehiclePreco: vehicle.preco,
          vehicleDescricao: vehicle.descricao,
          imagem: vehicle.images,
          veiculoId: vehicle.id,
          usuarioId: this.usuario?.id,
        } as ReserveListView;
      });
    })
  }

  deleteCart() {
    this.cartReserveService.deleteCart(this.deleteIndex!);
    this.close();
  }

  show(index: number) {
    this.deleteIndex = index;
    this.isDialogOpen = true;
    this.dialogRef.nativeElement.showModal();
  }

  close() {
    this.isDialogOpen = false;
    this.dialogRef.nativeElement.close();
  }


  navigateToVehicles() {
    this.#router.navigate(['home', 'vehicles', 'cars']);
  }
}
