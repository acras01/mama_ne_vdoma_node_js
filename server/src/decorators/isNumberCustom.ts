import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsNumberCustom(
  min,
  max,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isNumberWithinRange',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value === 'number' && value >= min && value <= max) {
            return true;
          }
          return false;
        },
        defaultMessage(args: ValidationArguments) {
          return `Поле ${args.property} має бути числом в діапазоні від ${min} до ${max}`;
        },
      },
    });
  };
}
