import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsNotEmptyCustom(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isNotEmptyCustom',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (value !== null && value !== undefined && value !== '') {
            return true;
          }
          return false;
        },
        defaultMessage(args: ValidationArguments) {
          return `Поле ${args.property} не має бути пустим`;
        },
      },
    });
  };
}
