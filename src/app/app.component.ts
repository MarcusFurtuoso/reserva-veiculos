import { CommonModule } from '@angular/common';
import { AuthService } from './service/auth.service';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { Alert, AlertService } from './service/alert.service';
import { Subscription } from 'rxjs';
import { AlertComponent } from './components/alert/alert.component';
import { LoadingService } from './service/loading.service';
import { LoadingComponent } from './components/loading/loading.component';


@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, RouterOutlet, FontAwesomeModule, NavBarComponent, AlertComponent, LoadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'reserva-veiculos';

  alert: Alert | null = null;

  private alertSubscription: Subscription = new Subscription();

  #authProvider = inject(AuthService);
  #alertService = inject(AlertService);
  protected loadingService = inject(LoadingService);

  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far);
  }

  ngOnInit() {
    this.alertSubscription = this.#alertService.alert$.subscribe(alert => {
      this.alert = alert;
    });
  }

  ngOnDestroy() {
    this.alertSubscription.unsubscribe();
  }

  isLoggedIn() {
    return this.#authProvider.isLogged();
  }
}
