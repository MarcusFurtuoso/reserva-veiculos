import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  public getItemForLocalStorage(key: string): string | null {
    return localStorage.getItem(key);
  }

  public setItemForLocalStorage(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  public removeItemForLocalStorage(key: string): void {
    localStorage.removeItem(key);
  }

  public clearLocalStorage(): void {
    localStorage.clear();
  }
}
