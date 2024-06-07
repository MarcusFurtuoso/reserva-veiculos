import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListVehiclesComponent } from '../../components/list-vehicles/list-vehicles.component';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [RouterModule, NavBarComponent, ListVehiclesComponent, FontAwesomeModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{

  isAdmin: boolean = false;

  #authService = inject(AuthService);

  ngOnInit(): void {
    this.isAdmin = this.#authService.verifyIsAdmin();
    // console.log(this.isAdmin);
  }

}
