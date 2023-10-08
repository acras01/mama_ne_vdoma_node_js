import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import BackBlazeB2 from 'backblaze-b2';
import { ConfigService } from '@nestjs/config';
import { IEnv } from 'src/configs/env.config';
import { Model } from 'mongoose';
import { FileModel } from './models/file.model';
import { InjectModel } from '@m8a/nestjs-typegoose';
@Injectable()
export class BackblazeService {
  private readonly bucketId: string;
  constructor(
    @Inject('bb2Client') private readonly bb2: BackBlazeB2,
    @InjectModel(FileModel) private readonly fileModel: Model<FileModel>,
    private readonly configService: ConfigService<IEnv>,
  ) {
    this.bucketId = configService.get('BB2_FILES_BUCKET_ID');
  }
  async uploadFile(file: Buffer, name: string) {
    try {
      const { data } = await this.bb2.getUploadUrl({
        bucketId: this.bucketId,
      });
      const result = await this.bb2.uploadFile({
        data: file,
        fileName: name,
        uploadUrl: data.uploadUrl,
        uploadAuthToken: data.authorizationToken,
      });
      const url = result.data.fileId;
      const newFile: FileModel = { Url: url, name };
      await this.fileModel.create(newFile);
      return url;
    } catch (error) {
      console.error(error);
      throw new Error('Something goes wrong');
    }
  }

  async getFileInfo(url: string) {
    const res = await this.fileModel.findOne({ Url: url });
    if (res === null) {
      throw new NotFoundException('File not found');
    }
    return res;
  }

  async getFile(id: string) {
    await this.getFileInfo(id);
    try {
      const res = await this.bb2.downloadFileById({
        fileId: id,
        responseType: 'stream',
      });
      return res.data;
    } catch (error) {
      throw new Error('Something goes wrong');
    }
  }

  async getFilesByCategory(category: string): Promise<FileModel[]> {
    return this.fileModel.find({ category: category.toLowerCase() }).exec();
  }

  async checkMissingPhotos(photos: string[]): Promise<string[]> {
    const missingPhotos = [];
    const results = await Promise.allSettled(
      photos.map((photo) => this.getFileInfo(photo)),
    );

    results.forEach((result, id) => {
      if (result.status === 'rejected') missingPhotos.push(photos[id]);
    });

    return missingPhotos;
  }

  async deleteFile(id: string): Promise<boolean> {
    await this.getFileInfo(id);
    const { fileName } = (await this.bb2.getFileInfo({ fileId: id })).data;
    (await this.bb2.deleteFileVersion({ fileId: id, fileName })).data;
    await this.fileModel.deleteOne({ Url: id });
    return true;
  }
}
