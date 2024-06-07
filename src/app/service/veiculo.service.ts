import { PaginationResponse } from './../models/dtos/pagination-dto';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IVehicleImagesResponse } from '../models/dtos/vehicle-images-dto';
import { Vehicle } from '../models/forms/vehicle.model';
import { IVehicleResponse } from '../models/dtos/vehicle-dto';

@Injectable({
  providedIn: 'root',
})
export class VeiculoService {
  #http = inject(HttpClient);

  API = 'http://localhost:8080/api/veiculo';

  getAllVehicles(): Observable<Vehicle[]> {
    return this.#http.get<Vehicle[]>(`${this.API}`);
  }

  getAllVehiclesPaginated(page: number, size: number, vehicleType?: string): Observable<PaginationResponse<Vehicle>> {
    let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString());

    if (vehicleType) {
      params = params.set('tipo', vehicleType);
    }

    return this.#http.get<PaginationResponse<Vehicle>>(`${this.API}/all-paginated`, { params });
  }

  getAllVehiclesBySearch(page: number, size: number, vehicleName: string): Observable<Vehicle[]> {
    let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString())
    .set('nome', vehicleName);

    return this.#http.get<Vehicle[]>(`${this.API}/all-search`, { params });
  }

  getAllCars(): Observable<Vehicle[]> {
    return this.#http.get<Vehicle[]>(`${this.API}/carros`);
  }

  getAllMotorcycles(): Observable<Vehicle[]> {
    return this.#http.get<Vehicle[]>(`${this.API}/motos`);
  }

  getAllTrucks(): Observable<Vehicle[]> {
    return this.#http.get<Vehicle[]>(`${this.API}/caminhoes`);
  }

  getVehicleImages(veiculoId: number): Observable<IVehicleImagesResponse[]> {
    let params = new HttpParams().set('veiculoId', veiculoId.toString());
    return this.#http.get<IVehicleImagesResponse[]>(`${this.API}/imagens`, { params });
  }

  findById(veiculoId: number): Observable<IVehicleResponse> {
    return this.#http.get<IVehicleResponse>(`${this.API}/${veiculoId}`);
  }

  update(veiculoId: number, veiculo: Vehicle): Observable<Vehicle> {
    return this.#http.put(`${this.API}/${veiculoId}`, veiculo);
  }

  save(veiculo: any) {
    return this.#http.post(`${this.API}`, veiculo);
  }

  delete(veiculoId: number) {
    return this.#http.delete(`${this.API}/${veiculoId}`);
  }
}
