import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IUsuarioPerfilResponse } from '../models/dtos/usuario-perfil-save';
import { UsuarioPerfilForm } from '../models/forms/profile-user.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  API = 'http://localhost:8080/api/usuario'

  #http = inject(HttpClient);

  constructor() { }

  addUsuarioToPerfil(usuarioPerfil: UsuarioPerfilForm): Observable<IUsuarioPerfilResponse> {
    return this.#http.post<IUsuarioPerfilResponse>(`${this.API}/add-perfil`, usuarioPerfil);
  }
}
