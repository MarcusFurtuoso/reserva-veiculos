import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Alert {
  message: string;
  type: 'success' | 'error' | 'info' | 'warn';
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private alertSubject: BehaviorSubject<Alert | null>;
  public alert$: Observable<Alert | null>;

  constructor() {
    this.alertSubject = new BehaviorSubject<Alert | null>(null);
    this.alert$ = this.alertSubject.asObservable();
  }

  private showAlert(message: string, type: 'success' | 'error' | 'info' | 'warn', duration: number) {
    this.alertSubject.next({ message, type });

    setTimeout(() => {
      this.alertSubject.next(null);
    }, duration);
  }

  success(message: string) {
    this.showAlert(message, 'success', 2000);
  }

  error(message: string) {
    this.showAlert(message, 'error', 5000);
  }

  info(message: string) {
    this.showAlert(message, 'info', 2000);
  }

  warn(message: string) {
    this.showAlert(message, 'warn', 2000);
  }
}
