import { FileValidator } from '@nestjs/common';
import path from 'path';

type CustomFileTypeValidatorOptions = {
  fileExtensions: string[];
};

export class CustomFileTypeValidator extends FileValidator<CustomFileTypeValidatorOptions> {
  buildErrorMessage(): string {
    return (
      'Invalid file extension. Allowed extensions are: ' +
      this.validationOptions.fileExtensions.join(', ')
    );
  }

  isValid(file: Express.Multer.File): boolean {
    if (!file) return false;

    const fileExtension = path.extname(file.originalname).toLowerCase();

    return this.validationOptions.fileExtensions.includes(fileExtension);
  }
}
