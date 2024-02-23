import {
  registerDecorator,
  ValidationOptions,
  isStrongPassword,
} from 'class-validator';

export function IsStrongPasswordCustom(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPasswordCustom',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return isStrongPassword(value, {
            minNumbers: 1,
            minSymbols: 1,
            minLength: 6,
          });
        },
        defaultMessage() {
          return 'Пароль не відповідає вимогам (мінімум 6 символів, 1 число та 1 символ)';
        },
      },
    });
  };
}
