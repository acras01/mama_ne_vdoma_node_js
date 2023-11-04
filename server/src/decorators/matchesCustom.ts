import { registerDecorator, ValidationOptions } from 'class-validator';

export function MatchesCustom(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'matchesCustom',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const pattern = /^[a-zA-Zа-яА-Яі0-9 -]+$/gm;
          return pattern.test(value);
        },
        defaultMessage() {
          return 'Має містити лише букви або пробіл';
        },
      },
    });
  };
}
