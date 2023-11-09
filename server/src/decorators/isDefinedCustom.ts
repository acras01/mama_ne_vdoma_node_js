import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsDefinedCustom(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isDefinedCustom',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (value !== null && value !== undefined) {
            return true;
          }
          return false;
        },
        defaultMessage(args: ValidationArguments) {
          return `Поле ${args.property} має бути визначеним`;
        },
      },
    });
  };
}
