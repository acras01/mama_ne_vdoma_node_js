import {
  MaxFileSizeValidator,
  ParseFilePipe,
  UploadedFile,
} from '@nestjs/common';
import { CustomFileTypeValidator } from '../custom-file-type-validator/CustomFileTypeValidator';

export const ValidateUploadFile = (maxSize: number, fileExtensions: string[]) =>
  UploadedFile(
    new ParseFilePipe({
      fileIsRequired: true,
      validators: [
        new MaxFileSizeValidator({ maxSize }),
        new CustomFileTypeValidator({
          fileExtensions,
        }),
      ],
    }),
  );
