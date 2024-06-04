import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IProfileListResponse } from '../models/dtos/profile-list';
import { HttpClient } from '@angular/common/http';
import { ProfileForm } from '../models/forms/profile.model';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  API = 'http://localhost:8080/api/perfil'

  #http = inject(HttpClient);

  save(profile: ProfileForm): Observable<IProfileListResponse> {
    return this.#http.post<IProfileListResponse>(`${this.API}`, profile);	;
  }

  update(profielId: number, profile: ProfileForm): Observable<IProfileListResponse> {
    return this.#http.put<IProfileListResponse>(`${this.API}/${profielId}`, profile);
  }

  delete(profileId: number): Observable<void> {
    return this.#http.delete<void>(`${this.API}/${profileId}`);
  }

  listAll(): Observable<IProfileListResponse[]> {
    return this.#http.get<IProfileListResponse[]>(this.API);
  }


}
