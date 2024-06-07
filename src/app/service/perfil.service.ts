import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IProfileListResponse } from '../models/dtos/profile-list';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  listAllPaginated(page: number, size: number): Observable<IProfileListResponse[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.#http.get<IProfileListResponse[]>(`${this.API}/all-paginated`, { params });
  }
}
