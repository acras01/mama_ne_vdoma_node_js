import { ValidationOptions, ValidateBy } from 'class-validator';

export function LengthCustom(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    const minLength = 6;
    const maxLength = 24;

    ValidateBy(
      {
        name: 'lengthCustom',
        constraints: [minLength, maxLength],
        validator: {
          validate(value: any, args) {
            const [minLength, maxLength] = args.constraints;
            return value.length >= minLength && value.length <= maxLength;
          },
          defaultMessage() {
            return `Довжина паролю має бути між ${minLength} та ${maxLength} символами`;
          },
        },
      },
      validationOptions,
    )(object, propertyName);
  };
}
