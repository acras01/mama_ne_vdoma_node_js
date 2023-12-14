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
          const pattern = /^[a-zA-Zа-яА-ЯҐґєЄіІїЇ0-9 -]+$/gmi;
          return pattern.test(value);
        },
        defaultMessage() {
          return 'Має містити лише букви, дефіс або пробіл';
        },
      },
    });
  };
}
