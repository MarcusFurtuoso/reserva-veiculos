import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IImageVehicleDto } from '../models/dtos/image-vehicle-dto';
import { ImageUpdateVehicle } from '../models/forms/img-update-vehicle.model';
import { ImageVehicle } from '../models/forms/img-vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class ImagemVeiculoService {

  API = 'http://localhost:8080/api/imagem-veiculo'

  #http = inject(HttpClient);

  save(image: ImageVehicle): Observable<IImageVehicleDto> {
    return this.#http.post<IImageVehicleDto>(`${this.API}/${image.veiculoId}`, image);
  }

  update(veiculoId: number, image: ImageUpdateVehicle): Observable<IImageVehicleDto> {
    return this.#http.put<IImageVehicleDto>(`${this.API}/${veiculoId}`, image);
  }

  delete(imagemVeiculoId: number): Observable<void> {
    return this.#http.delete<void>(`${this.API}/${imagemVeiculoId}`);
  }

}
