import { Injectable } from "@angular/core";
import { NgForm } from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class MessageErrorResolver {
  protected validations: Map<string, string> = new Map([
    ['required', 'This field is required.'],
    ['minlength', 'Field has not reached minimum character count.'],
    ['maxlength', 'The field exceeded the maximum characters.'],
    ['mask', 'The value entered does not match the expected format.'],
    ['min', 'The amount exceeded the minimum allowed.'],
    ['max', 'The amount exceeded the maximum allowed.'],
    ['email', 'Enter a valid e-mail address.'],
    ['pattern', 'The field format is invalid.'],
    ['passwordMismatch', 'Passwords do not match.']
  ]);

  showErrorMessageForKey(form: NgForm, key: string): string {
    let message: string | undefined;

    const formControl = form.controls[key];

    if ((formControl?.invalid && formControl?.touched) || formControl?.dirty) {

      this.validations.forEach((_, validationKey) => {

        if (formControl.errors?.[validationKey]) {

          message = this.validations.get(validationKey);
        }
      });

      if (key === 'confirmPassword' && !this.checkPasswordsMatch(form)) {
        message = this.validations.get('passwordMismatch');
      }
    }
    return message ? message : "";
  }

  checkPasswordsMatch(form: NgForm): boolean {
    const password = form.controls['senha'];
    const confirmPassword = form.controls['confirmPassword'];

    if (password && confirmPassword) {
      return password.value === confirmPassword.value;
    }

    return false;
  }
}
