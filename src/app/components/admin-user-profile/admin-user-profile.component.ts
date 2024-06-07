import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UsuarioPerfilForm } from '../../models/forms/profile-user.model';
import { AlertService } from '../../service/alert.service';
import { LoadingService } from '../../service/loading.service';
import { UsuarioService } from '../../service/usuario.service';
import { MessageErrorResolver } from '../../utils/message-error-resolver';
import { DialogComponent } from '../dialog/dialog.component';
import { InputComponent } from '../input/input.component';
import { PerfilService } from '../../service/perfil.service';
import { IProfileListResponse } from '../../models/dtos/profile-list';

@Component({
  selector: 'app-admin-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    DialogComponent,
    InputComponent,
  ],
  template: `
    <div class="min-h-96 space-y-3 px-4">
      <div class="mb-10">
        <h1 class="text-3xl font-bold">User Profile</h1>
      </div>
      <form (ngSubmit)="onSubmit()" #form="ngForm">
        <div class="grid grid-cols-3 gap-3">
          <div class="col-span-2 item">
            <label for="login" class="block text-sm font-medium text-gray-700"
              >User Login</label
            >
            <input
             required="true"
             type="email"
             placeholder="Enter with user's email"
             name="login"
             #login="ngModel"
             pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"
             [(ngModel)]="userProfile.login"
             [ngClass]="{
                'invalid:border-red-600': login.invalid && login.touched && login.dirty
              }"
             class="mt-1 block w-full px-2 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
             >
             @if (login.getError('pattern')) {
                  <small class="text-xs text-red-600">Enter a valid e-mail address.</small>
              } @else if (login.invalid && login.touched && login.dirty) {
                  <small class="text-xs text-red-600">This field is required.</small>
              }

          </div>
          <div class="col-span-1">
            <label for="perfil" class="block text-sm font-medium text-gray-700"
              >Perfil</label
            >
            <select
              id="perfil"
              name="perfil"
              [(ngModel)]="userProfile.perfil"
              #perfil="ngModel"
              required
              [ngClass]="{
                'invalid:border-red-600': perfil.invalid && perfil.touched
              }"
              class="mt-1 block w-full px-2 py-[0.595rem] bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            >
              <option [ngValue]="undefined">Select</option>

              @for (profile of profiles; track profile) {
              <option [ngValue]="profile.nome">{{ profile.nome }}</option>
              }
              <!-- <option value="ADMIN">Admin</option>
              <option value="USER">User</option>
              <option value="GERENTE">Gerente</option> -->
            </select>
            @if (perfil.invalid && perfil.touched) {
            <small class="text-xs text-red-600">This field is required.</small>
            }
          </div>
          <div class="">
            <button
              type="button"
              (click)="show()"
              [disabled]="form.invalid"
              class="bg-[#ED5A2F] rounded-md px-6 py-1.5 text-sm text-white font-medium hover:bg-[#ff754b] transition duration-300 ease-in-out"
            >
              Add User to Profile
              <fa-icon
                icon="arrow-right-from-bracket"
                class=" pl-2 text-white"
              />
            </button>
          </div>
        </div>

        <dialog
          [style.display]="isDialogOpen ? 'block' : 'none'"
          class="rounded-2xl bg-transparent backdrop:bg-black/50 fixed inset-0 z-50"
          #dialogRef
        >
          <div
            class="group select-none w-[20rem] flex flex-col p-4 relative items-center bg-zinc-800 border border-zinc-800 shadow-lg rounded-2xl"
          >
            <div class="">
              <div class="text-center p-3 flex-auto justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  class="group-hover:animate-bounce w-12 h-12 flex items-center text-gray-600 fill-[#ED5A2F] mx-auto"
                >
                  <path
                    fill-rule="evenodd"
                    d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0Zm-5-2a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM8 9c-1.825 0-3.422.977-4.295 2.437A5.49 5.49 0 0 0 8 13.5a5.49 5.49 0 0 0 4.294-2.063A4.997 4.997 0 0 0 8 9Z"
                    clip-rule="evenodd"
                  />
                </svg>

                <h2 class="text-xl font-bold py-4 text-gray-200">
                  Are you sure?
                </h2>
                <p class="font-bold text-sm text-gray-500 px-2">
                Do you really want to add this profile: "{{ perfil.value }}" to this user: "{{ usuario }}" ?
                </p>
              </div>
              <div class="p-2 mt-2 text-center space-x-2 md:block">
                <button
                  type="button"
                  (click)="close()"
                  class="mb-2 md:mb-0 bg-gray-700 px-5 py-2 text-sm shadow-sm font-medium tracking-wider border-2 border-gray-600 hover:border-gray-700 text-gray-300 rounded-full hover:shadow-lg hover:bg-gray-800 transition ease-in duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="bg-[#ED5A2F] hover:bg-transparent px-5 ml-4 py-2 text-sm shadow-sm hover:shadow-lg font-medium tracking-wider border-2 border-[#ED5A2F] hover:bg-[#ff754b] text-white hover:text-[#ED5A2F] rounded-full transition ease-in duration-300"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </dialog>
      </form>
    </div>
  `,
})
export class AdminUserProfileComponent implements OnInit {

  readonly #alertService = inject(AlertService);
  readonly #loadingService = inject(LoadingService);
  readonly #userService = inject(UsuarioService);
  readonly #perfilService = inject(PerfilService);
  protected messageError = inject(MessageErrorResolver);

  @ViewChild('form') form!: NgForm;

  userProfile: UsuarioPerfilForm = new UsuarioPerfilForm();

  isDialogOpen = false;

  perfil: string = '';
  usuario: string = '';
  profiles: IProfileListResponse[] = [];

  @ViewChild('dialogRef') dialogRef!: ElementRef<HTMLDialogElement>;

  ngOnInit(): void {
    this.listAllProfiles();
  }

  onSubmit() {
    this.#loadingService.isLoading.next(true);
    if (this.userProfile) {
      this.#userService.addUsuarioToPerfil(this.userProfile).subscribe({
        next: (response) => {
          // console.log(response);
          setTimeout(() => {
            this.#loadingService.isLoading.next(false);
            this.#alertService.success('User profile added successfully!');
            this.successRegister();
          }, 300);
          this.close();
        },
        error: (error) => {
          console.log(error);
          setTimeout(() => {
            this.#loadingService.isLoading.next(false);
            this.#alertService.error('Error while adding user profile.');
          }, 300);
          this.close();
        },
      });
    }

  }

  private listAllProfiles() {
    this.#perfilService.listAll().subscribe({
      next: (profiles) => {
        console.log(profiles);
        this.profiles = profiles;
      },
      error: (error) => {
        console.log(error);
        this.#alertService.error(error);
      },
    });
  }

  show() {
    this.perfil = this.userProfile.perfil!;
    this.usuario = this.userProfile.login!;
    this.isDialogOpen = true;
    this.dialogRef.nativeElement.showModal();
  }

  close() {
    this.isDialogOpen = false;
    this.dialogRef.nativeElement.close();
  }

  private successRegister() {
    this.userProfile = new UsuarioPerfilForm();
    this.form.resetForm(this.userProfile);
    this.userProfile.perfil = undefined;
  }
}
