import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsStringCustom(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isStringCustom',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string' || value instanceof String;
        },
        defaultMessage() {
          return 'Значення має бути строкою';
        },
      },
    });
  };
}
