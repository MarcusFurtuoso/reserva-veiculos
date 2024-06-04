import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { forkJoin, of, switchMap } from 'rxjs';
import { InputComponent } from '../../components/input/input.component';
import { IVehicleImagesResponse } from '../../models/dtos/vehicle-images-dto';
import { Vehicle } from '../../models/forms/vehicle.model';
import { AlertService } from '../../service/alert.service';
import { ImagemVeiculoService } from '../../service/imagem-veiculo.service';
import { VeiculoService } from '../../service/veiculo.service';
import { MessageErrorResolver } from '../../utils/message-error-resolver';
import { LoadingService } from '../../service/loading.service';

@Component({
  selector: 'app-add-update-vehicle',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, InputComponent],
  templateUrl: './add-update-vehicle.component.html',
  styleUrl: './add-update-vehicle.component.scss',
})
export class AddUpdateVehicleComponent implements OnInit {
  readonly #router = inject(Router);
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #vehicleService = inject(VeiculoService);
  readonly #imageVeiculoService = inject(ImagemVeiculoService);
  readonly #alertService = inject(AlertService);
  readonly #loadingService = inject(LoadingService);
  protected messageError = inject(MessageErrorResolver);

  @ViewChild('form') form!: NgForm;

  isDialogOpen = false;

  @ViewChild('dialogRef') dialogRef!: ElementRef<HTMLDialogElement>;

  isEdit: boolean = false;

  images: IVehicleImagesResponse[] = [];

  vehicle: Vehicle = new Vehicle();

  showDeleteButton: boolean[] = [];

  ngOnInit(): void {
    this.#activatedRoute.params
      .pipe(
        switchMap((params: Params) => {
          if (params['vehicleId']) {
            this.isEdit = true;
            return this.#vehicleService.findById(params['vehicleId']);
          }
          return of(null);
        }),
        switchMap((vehicle: Vehicle | null) => {
          if (vehicle) {
            console.log(vehicle);
            this.vehicle = vehicle;
            return this.#vehicleService.getVehicleImages(vehicle.id!);
          }
          return of(null);
        })
      )
      .subscribe({
        next: (response) => {
          // console.log(response);
          this.images = response ?? [];
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  onSubmit() {
    if (this.vehicle) {
      if (!this.isEdit) {
        this.save();
      } else {
        this.update();
      }
    }
  }

  private save(): void {
    this.#loadingService.isLoading.next(true);
    this.#vehicleService
      .save(this.vehicle)
      .pipe(
        switchMap((vehicle: Vehicle) => {
          console.log(vehicle);

          if (this.images.length > 0) {
            // console.log('IMAGES:' + this.images.map((image) => image.bytes));
            const imageObservables = this.images.map((image) => {
              const imageCopy = { ...image };

              imageCopy.veiculoId = vehicle.id!;
              imageCopy.bytes = imageCopy.bytes.split(',')[1];

              return this.#imageVeiculoService.save(imageCopy);
            });

            return forkJoin(imageObservables);
          }
          return of(vehicle);
        })
      )
      .subscribe({
        next: (response) => {
          console.log(response);
          setTimeout(() => {
            this.#loadingService.isLoading.next(false);
            this.#alertService.success('Vehicle successfully added!');
            this.successRegister();
            this.navigateToAdminVehicles();
          }, 500);

        },
        error: (error: Error) => {
          console.log(error);
          this.#loadingService.isLoading.next(false);
          this.#alertService.error('Vehicle registration error.');
        },
      });
  }

  private update(): void {
    this.#loadingService.isLoading.next(true);
    this.#vehicleService
      .update(this.vehicle.id!, this.vehicle)
      .pipe(
        switchMap((vehicle: Vehicle) => {
          console.log('UPDATE' + vehicle);

          const newImages = this.images.filter((image) => image.isNew); // Filtrar apenas novas imagens

          if (newImages.length > 0) {
            console.log('NEW IMAGENS:' + newImages.map((image) => image.bytes));
            const imageObservables = newImages.map((image) => {
              const imageCopy = { ...image };

              imageCopy.veiculoId = vehicle.id!;
              imageCopy.bytes = imageCopy.bytes.split(',')[1];

              return this.#imageVeiculoService.update(vehicle.id!, imageCopy);
            });

            return forkJoin(imageObservables);
          }
          return of(vehicle);
        })
      )
      .subscribe({
        next: (response) => {
          console.log(response);
          setTimeout(() => {
            this.#loadingService.isLoading.next(false);
            this.navigateToAdminVehicles();
            this.#alertService.success('Vehicle successfully updated!');
          }, 500);
          this.close();
        },
        error: (error: Error) => {
          console.log(error);
          setTimeout(() => {
            this.#loadingService.isLoading.next(false);
            this.#alertService.error('Vehicle update error.');
          }, 500);
          this.close();
        },
      });
  }

  deleteImage(imageId: number, index: number) {
    console.log(imageId);

    if(!imageId) {
      this.images = this.images.filter((img, i) => i !== index);
      return;
    }
    this.#imageVeiculoService
      .delete(imageId!)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.images = this.images.filter((img) => img.id !== imageId);
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  protected show() {
    this.isDialogOpen = true;
    this.dialogRef.nativeElement.showModal();
  }

  protected close() {
    this.isDialogOpen = false;
    this.dialogRef.nativeElement.close();
  }

  private successRegister() {
    this.vehicle = new Vehicle();
    this.form.reset();
  }

  protected navigateToAdminVehicles() {
    this.#router.navigate(['admin', 'vehicles']);
  }

  protected addImage(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  protected onChange = async ($event: any) => {
    const target = $event.target as HTMLInputElement;

    // Obtenha todos os arquivos selecionados
    const files: FileList = target.files!;

    // Converta cada arquivo para base64
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const fileBase64 = (await this.fileToBase64(file)) as string;

      const image: IVehicleImagesResponse = {
        nome: file.name,
        bytes: fileBase64,
        extensao: file.type.split('/')[1],
        veiculoId: this.vehicle.id!,
        isNew: true,
      };

      // Se o veículo já existir, adicione as novas imagens ao array `images` existente
      if (this.vehicle) {
        this.images.push(image);
      } else {
        // Se o veículo não existir, crie um novo array `images`
        this.images = [image];
      }
    }
  };

  private fileToBase64(file: File): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;

        resolve(base64);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  }
}
