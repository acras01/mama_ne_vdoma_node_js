import {
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
  Res,
  BadRequestException,
  Delete,
  Header,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { BackblazeService } from './backblaze.service';

import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ValidateUploadFile } from './decorators/validate.upload.single.file.decorator';

@ApiTags('files')
@Controller('files')
export class BackBlazeController {
  constructor(private readonly backblazeService: BackblazeService) {}
  @Post('image')
  @ApiCreatedResponse({ description: 'Array of ids of created image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['image'],
      properties: {
        image: {
          description: 'Image to upload',
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @ValidateUploadFile(2_097_152, ['.ico', '.png', '.jpeg', '.jpg'])
    image: Express.Multer.File,
  ) {
    if (!image) {
      throw new BadRequestException('No files uploaded');
    }
    const link = await this.backblazeService.uploadFile(
      image.buffer,
      image.originalname,
    );
    return link;
  }

  @ApiNotFoundResponse({ description: 'File not found' })
  @ApiOkResponse()
  @Get(':url')
  @Header('Cache-control', 'max-age=31536000')
  async getFileByUrl(@Param('url') url: string, @Res() response: Response) {
    const stream = await this.backblazeService.getFile(url);
    response.setHeader('Content-type', 'image');
    stream.on('data', (data) => response.write(data));
    stream.on('end', () => {
      response.end();
    });
  }

  @ApiOkResponse()
  @ApiNotFoundResponse({ description: 'File not found' })
  @Delete(':id')
  async deleteFileById(@Param('id') id: string) {
    const result = await this.backblazeService.deleteFile(id);
    return { status: result };
  }
}
