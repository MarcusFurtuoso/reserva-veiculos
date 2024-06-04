import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IReserveResponse } from '../models/dtos/reserve-save-dto';
import { IReserveUsuarioListResponse } from '../models/dtos/reserve-usuario-list';
import { Reserve } from '../models/forms/reserve.model';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {


  API = 'http://localhost:8080/api/reserva'

  #http = inject(HttpClient);

  constructor() { }

  save(reserve: Reserve): Observable<IReserveResponse> {
    return this.#http.post<IReserveResponse>(`${this.API}`, reserve);
  }

  listAllByUsuario(usuarioId: number): Observable<IReserveUsuarioListResponse[]> {
    let params = new HttpParams().set('usuarioId', usuarioId);
    return this.#http.get<IReserveUsuarioListResponse[]>(`${this.API}/usuario`, { params });
  }

  findById(reserveId: number): Observable<IReserveUsuarioListResponse> {
    return this.#http.get<IReserveUsuarioListResponse>(`${this.API}/${reserveId}`);
  }
}
