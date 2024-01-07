import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsNotEmptyPasswordCustom(
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isNotEmptyCustom',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return value !== null && value !== undefined && value !== '';
        },
        defaultMessage() {
          return 'Поле паролю не має буди пустим';
        },
      },
    });
  };
}
