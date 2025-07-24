import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class EmailFormatValidator {
  static emailFormat(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: string = control.value || '';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) ? null : { invalidEmail: true };
    };
  }
}
