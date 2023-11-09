import { Injectable } from '@nestjs/common';
import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'GroupAgeValidateRule' })
@Injectable()
export class GroupAgeValidateRule implements ValidatorConstraintInterface {
  validate(ages: string) {
    const splitted = ages.split('-');
    if (splitted.length > 2) return false;
    if (splitted.length === 1) {
      const number = Number(splitted[0]);
      if (Number.isNaN(number)) return false;
      return number <= 18 && number >= 0;
    }
    for (let i = 0; i > 2; i++) {
      const number = Number(splitted[i]);
      if (Number.isNaN(number) && number <= 18 && number >= 0) return false;
    }
    return Number(splitted[0]) < Number(splitted[1]);
  }

  defaultMessage() {
    return `Невірний формат в полі віку`;
  }
}

export function GroupAgeValidate(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'GroupAgeValidate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: GroupAgeValidateRule,
    });
  };
}
