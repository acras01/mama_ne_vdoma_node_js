import { ValidationOptions, ValidateBy } from 'class-validator';

export function LengthCustom(
  minLength,
  maxLength,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
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
