import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Vehicle } from '../models/forms/vehicle.model';
import { ReserveListView } from '../models/dtos/reserve-list-view';


@Injectable({
  providedIn: 'root',
})
export class CartReserveService {


  protected cart: Vehicle[] = [];

  private vehiclesInCart$ = new BehaviorSubject<number>(0);

  constructor() {}

  getVehiclesInCart() {
    return this.vehiclesInCart$.asObservable();
  }

  getCart() {
    return this.cart;
  }

  addVehicleToCart(vehicle: Vehicle) {
    this.cart.push(vehicle);
    this.vehiclesInCart$.next(this.cart.length);
  }
  deleteCart(index: number) {
    if (index >= 0 && index < this.cart.length) {
      this.cart.splice(index, 1);
      this.vehiclesInCart$.next(this.cart.length);
    }
  }

  clearCart() {
    this.cart = [];
    this.vehiclesInCart$.next(0);
  }
}
