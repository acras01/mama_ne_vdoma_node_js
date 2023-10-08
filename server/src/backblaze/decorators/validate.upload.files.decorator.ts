import {
  MaxFileSizeValidator,
  ParseFilePipe,
  UploadedFiles,
} from '@nestjs/common';
import { ParseFilesPipe } from '../pipes/parse-files.pipe';
import { CustomFileTypeValidator } from '../custom-file-type-validator/CustomFileTypeValidator';

export const ValidateUploadFiles = (
  maxSize: number,
  fileExtensions: string[],
) =>
  UploadedFiles(
    new ParseFilesPipe(
      new ParseFilePipe({
        fileIsRequired: true,
        validators: [
          new MaxFileSizeValidator({ maxSize }),
          new CustomFileTypeValidator({
            fileExtensions,
          }),
        ],
      }),
    ),
  );
