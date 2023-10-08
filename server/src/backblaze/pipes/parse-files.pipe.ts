import { type ParseFilePipe, type PipeTransform } from '@nestjs/common';

export class ParseFilesPipe implements PipeTransform<Express.Multer.File[]> {
  constructor(private readonly pipe: ParseFilePipe) {}
  async transform(files: Express.Multer.File[]) {
    for (const file of files) {
      await this.pipe.transform(file);
    }
    return files;
  }
}
