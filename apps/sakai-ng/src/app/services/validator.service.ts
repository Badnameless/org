import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  public FullnamePattern: string = '[a-zA-Zñáéíóú]+(?: [a-zA-Zñáéíóú ]+){1,}';
  public floatPattern: string = '[0-9]*(\.[0-9]+)?';
  public emailPattern: string = '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}';
  public cedrncPattern: string = '^(?:[0-9]{9})$|^(?:[0-9]{11})$';
  public passwordPattern: RegExp = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/;

  public isValidField(form: FormGroup, field: string): boolean | null {
    return form.controls[field].errors && form.controls[field].touched;
  }

  public compareTwoFields(field1: string, field2: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const fieldValue1 = formGroup.get(field1)?.value;
      const fieldValue2 = formGroup.get(field2)?.value;

      if (fieldValue1 !== fieldValue2) {
        formGroup.get(field2)?.setErrors({ notTheSame: true })
        return { notTheSame: true }
      }

      formGroup.get(field2)?.setErrors(null)
      return null;
    }
  }

  public getFieldError(form: FormGroup, field: string): string | null {
    if (!form.controls[field]) return null;

    const errors = form.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';

        case 'emailIsTaken':
          return 'Este E-mail ya existe';

        case 'rnccedIsTaken':
          return 'El RNC o CEDULA ya existe'

        case 'minlength':
          return `Minimo de ${errors['minlength'].requiredLength} caracteres`;

        case 'notTheSame':
          return 'Las contraseñas no coinciden';

        case 'pattern':

          switch (errors['pattern'].requiredPattern) {
            case `^${this.FullnamePattern}$`:
              return 'Nombre y apellido invalido';

            case `^${this.emailPattern}$`:
              return 'Formato de E-mail invalido';

            case `^${this.floatPattern}$`:
              return 'Formato numerico invalido';

            case `${this.cedrncPattern}`:
              return 'RNC o CEDULA invalida';

            case `${this.passwordPattern}`:
              return 'Formato de contraseña invalido'

            default:
              break;
          }
          break;

        default:
          return 'Validation not found'
      }
    }
    return null;

  }
}
