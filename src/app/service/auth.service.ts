import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { ITokenPayload } from '../models/dtos/token-payload';
import { ITokenDto } from '../models/dtos/user-login-dto';
import { IUserRegisterResponse } from '../models/dtos/user-register-dto';
import { User } from '../models/forms/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #http = inject(HttpClient);
  #router = inject(Router);

  isAdmin?: boolean = false;

  loggedUser = new BehaviorSubject<ITokenPayload | null>(null);

  API = 'http://localhost:8080/api/auth';

  constructor() {
    const token = localStorage.getItem('token');
    if (token) {
      const user = this.decodeJwtToken(token);
      this.loggedUser.next(user);
    }
  }

  getUsuarioLogged(): Observable<ITokenPayload | null> {
    return this.loggedUser.asObservable();
  }

  login(form: User): Observable<ITokenDto> {
    return this.#http
      .post<ITokenDto>(`${this.API}/login`, form)
      .pipe(
        map((res) => res),
        tap((res): void => {
          this.storeTokenAndLoggedUser(res.token);
        })
      );
  }

  register(user: User): Observable<IUserRegisterResponse> {
    return this.#http.post<IUserRegisterResponse>(`${this.API}/register`, user);
  }

  public logout(): void {
    localStorage.clear();
    this.loggedUser.next(null);
    this.#router.navigate(['auth']);
  }

  public isLogged(): boolean {
    return !!localStorage.getItem('token');
  }

  verifyIsAdmin(): boolean {
    const user = this.loggedUser.value;
    return this.isAdmin = user?.user.authorities.includes('ROLE_ADMIN') ?? false;
  }

  storeTokenAndLoggedUser(jwt: string): void {
    setTimeout(() => {
      localStorage.setItem('token', jwt);
    }, 300);
    const data: ITokenPayload | null = this.decodeJwtToken(jwt);
    this.loggedUser.next(data);
    console.log(this.loggedUser);
  }

  private decodeJwtToken(jwt: string): any | null {
    try {
      const payload = jwtDecode<any>(jwt);
      return payload;
    } catch (error: any) {
      return null;
    }
  }
}
