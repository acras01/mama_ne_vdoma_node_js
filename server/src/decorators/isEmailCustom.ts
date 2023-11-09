import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsEmailCustom(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isEmailCustom',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (
            !value ||
            !value.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/)
          ) {
            return false;
          }
          return true;
        },
        defaultMessage() {
          return 'Не є електронною поштою';
        },
      },
    });
  };
}
