import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsNotEmptyObjectCustom(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isNotEmptyObjectCustom',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (
            typeof value === 'object' &&
            value !== null &&
            Object.keys(value).length > 0
          ) {
            return true;
          }
          return false;
        },
        defaultMessage(args: ValidationArguments) {
          return `Поле ${args.property} має бути не пустим об'єктом`;
        },
      },
    });
  };
}
