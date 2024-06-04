import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
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

@Component({
  selector: 'app-reserves',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FormsModule],
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
          imagem: vehicle.image,
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
