import { AbstractControl, ValidatorFn } from '@angular/forms';

export class HexValidator {

  static hexFormat(): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      if (c.value && c.value === '0') {
        return { hexFormat: true };
      }
      return null;
    };
  }
}
