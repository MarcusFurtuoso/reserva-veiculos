import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IProfileListResponse } from '../../models/dtos/profile-list';
import { ProfileForm } from '../../models/forms/profile.model';
import { AlertService } from '../../service/alert.service';
import { LoadingService } from '../../service/loading.service';
import { PerfilService } from '../../service/perfil.service';
import { MessageErrorResolver } from '../../utils/message-error-resolver';
import { DialogComponent } from '../dialog/dialog.component';
import { InputComponent } from '../input/input.component';

@Component({
  selector: 'app-admin-all-profiles',
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
    <form (ngSubmit)="onSubmit()" #form="ngForm">
      <div class="flex justify-between mb-6">
        <h1 class="text-3xl font-bold">All Profiles</h1>
        <div class="flex gap-2">
          <button
            type="submit"
            class="bg-[#ED5A2F] rounded-md px-6 py-1.5  text-black font-medium hover:bg-[#ff754b] transition duration-300 ease-in-out"
          >
            Save Changes
            <!-- <fa-icon icon="floppy-disk" class="pl-2 text-black" /> -->
            <fa-icon class="pl-2" [icon]="['far', 'floppy-disk']"></fa-icon>
          </button>
          <button
            (click)="addProfileToList()"
            type="button"
            class="bg-[#ED5A2F] rounded-md px-6 py-1.5  text-black font-medium hover:bg-[#ff754b] transition duration-300 ease-in-out"
          >
            Add Profile
            <fa-icon icon="plus" class="pl-2 text-black" />

          </button>
        </div>
      </div>

        @for (profile of profiles; track profile; let i = $index) {

        <div class="flex mb-4 gap-x-8 items-center">
          <div class="w-20 h-10">
            <label class="font-medium" for="price">Profile ID</label>
            <input
              required="true"
              class="border border-gray-500 py-1.5 rounded-md w-14 text-center"
              name="id{{ i }}"
              type="text"
              [(ngModel)]="profile.id"
              disabled="true"
            />
          </div>
          <div class="w-64  h-10">
            <label class="font-medium" for="price">Name</label>
            <input
              required="true"
              #inputNome
              class="border border-gray-500 px-2 py-2 rounded-md w-full text-sm"
              name="nome{{ i }}"
              [ngClass]="{ 'border-red-600': nome.invalid && nome.touched }"
              type="text"
              [(ngModel)]="profile.nome"
              #nome="ngModel"
              [disabled]="!profile.isEditable"
            />
            @if(nome.invalid && nome.touched) {
            <p class="text-red-600 text-sm pt-0.5">This field is required.</p>
            }
          </div>
          <div class="space-x-4 pt-11">
            <button
              (click)="editProfile(profile, i)"
              type="button"
              class="bg-[#ED5A2F] rounded-md px-6 py-1.5 text-black font-medium hover:bg-[#ff754b] transition duration-300 ease-in-out"
            >
              Edit
              <fa-icon icon="edit" class=" pl-2 text-black" />
            </button>
            <button
              (click)="selectProfileForDeletion(profile.id)"
              type="button"
              class="bg-red-600 rounded-md px-6 py-1.5 text-black font-medium hover:bg-red-500 transition duration-300 ease-in-out"
            >
              Delete
              <fa-icon icon="trash" class="pl-2 text-black" />
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
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  class="group-hover:animate-bounce w-12 h-12 flex items-center text-gray-600 fill-red-500 mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clip-rule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    fill-rule="evenodd"
                  ></path>
                </svg>
                <h2 class="text-xl font-bold py-4 text-gray-200">
                  Are you sure?
                </h2>
                <p class="font-bold text-sm text-gray-500 px-2">
                  Do you really want to exclude this profile? This process
                  cannot be undone
                </p>
              </div>
              <div class="p-2 mt-2 text-center space-x-2 md:block">
                <button
                  (click)="close()"
                  type="button"
                  class="mb-2 md:mb-0 bg-gray-700 px-5 py-2 text-sm shadow-sm font-medium tracking-wider border-2 border-gray-600 hover:border-gray-700 text-gray-300 rounded-full hover:shadow-lg hover:bg-gray-800 transition ease-in duration-300"
                >
                  Cancel
                </button>
                <button
                  (click)="deleteProfile()"
                  type="button"
                  class="bg-red-600 hover:bg-transparent px-5 ml-4 py-2 text-sm shadow-sm hover:shadow-lg font-medium tracking-wider border-2 border-red-600 hover:border-red-600 text-white hover:text-red-600 rounded-full transition ease-in duration-300"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </dialog>
        }
      </form>
    </div>
  `,
})
export class AdminAllProfilesComponent implements OnInit {

  readonly #alertService = inject(AlertService);
  readonly #perfilService = inject(PerfilService);
  readonly #loadingService = inject(LoadingService);
  protected messageError = inject(MessageErrorResolver);

  profiles: IProfileListResponse[] = [];

  isDialogOpen = false;

  isDisabeld = true;

  selectedProfileId: number | null = null;

  @ViewChild('dialogRef') dialogRef!: ElementRef<HTMLDialogElement>;
  @ViewChildren('inputNome') inputNomes!: QueryList<ElementRef>;

  ngOnInit(): void {
    this.listAllProfiles();
  }

  onSubmit() {
    let changesMade = false;

    this.profiles.forEach((profile) => {
      if (profile.isNew) {
        this.addProfile(profile);
        changesMade = true;
      } else if (profile.isEditable && profile.nome !== profile.originalNome) {
        this.updateProfile(profile);
        changesMade = true;
      }
    });

    if (!changesMade) {
      this.#alertService.info('No changes were made.');
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

  private addProfile(profile: IProfileListResponse) {
    this.#loadingService.isLoading.next(true);
    const newProfile: ProfileForm = { nome: profile.nome };

    this.#perfilService.save(newProfile).subscribe({
      next: (response) => {
        console.log(response);
        setTimeout(() => {
          this.#loadingService.isLoading.next(false);
          this.#alertService.success('Profile created successfully!');
          this.listAllProfiles();
        }, 300);
      },
      error: (error) => {
        console.log(error);
        setTimeout(() => {
          this.#loadingService.isLoading.next(false);
          this.#alertService.error('Error while adding profile.');
          this.listAllProfiles();
        }, 300);
      },
    });
  }

  private updateProfile(profile: IProfileListResponse) {
    this.#loadingService.isLoading.next(true);
    const updatedProfile: ProfileForm = { nome: profile.nome };

    this.#perfilService.update(profile.id, updatedProfile).subscribe({
      next: (response) => {
        console.log(response);
        setTimeout(() => {
          this.#loadingService.isLoading.next(false);
          this.#alertService.success('Profile updated successfully!');
          this.listAllProfiles();
        }, 300);
      },
      error: (error) => {
        console.log('Error updating profile:', error);
      },
    });
  }

  protected addProfileToList() {
    this.profiles.push({ id: 0, nome: '', isEditable: true, isNew: true });
  }

  protected editProfile(profile: IProfileListResponse, index: number) {
    profile.isEditable = true;
    profile.originalNome = profile.nome;
    setTimeout(() => this.inputNomes.toArray()[index].nativeElement.focus(), 0);
  }

  protected selectProfileForDeletion(profileId: number) {
    this.selectedProfileId = profileId;
    this.show();
  }

  protected deleteProfile() {
    console.log('Deleting profile with ID:', this.selectedProfileId);
    if (this.selectedProfileId !== null && this.selectedProfileId !== 0) {
      this.#loadingService.isLoading.next(true);
      console.log('Deleting profile with ID:', this.selectedProfileId);

      this.#perfilService.delete(this.selectedProfileId).subscribe({
        next: () => {
          setTimeout(() => {
            this.#loadingService.isLoading.next(false);
            this.#alertService.success('Profile deleted successfully!');
            this.listAllProfiles();
          }, 300);
          this.close();
          this.selectedProfileId = null;
        },
        error: (error) => {
          console.log(error);
          setTimeout(() => {
            this.#loadingService.isLoading.next(false);
            this.#alertService.error('Error deleting profile');
          }, 300);
          this.close();
        },
      });
    } else {
      this.profiles.pop();
      this.close();
    }
  }

  show() {
    this.isDialogOpen = true;
    this.dialogRef.nativeElement.showModal();
  }

  close() {
    this.isDialogOpen = false;
    this.dialogRef.nativeElement.close();
  }
}
