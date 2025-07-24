import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class RegisterValidator {
  static strongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: string = control.value || '';
      const errors: ValidationErrors = {};

      if (value.length < 8) {
        errors['minLength'] = true;
      }
      if (!/[A-Z]/.test(value) || !/[a-z]/.test(value)) {
        errors['upperLower'] = true;
      }
      if (!/\d/.test(value)) {
        errors['number'] = true;
      }
      if (!/[^a-zA-Z0-9]/.test(value)) {
        errors['specialChar'] = true;
      }

      return Object.keys(errors).length > 0 ? errors : null;
    };
  }

  static matchPasswords(passwordKey: string, confirmKey: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get(passwordKey)?.value;
      const confirm = group.get(confirmKey)?.value;
      return password === confirm ? null : { passwordMismatch: true };
    };
  }
}
