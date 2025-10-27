import { MultipartFile } from '@fastify/multipart';
import { HttpException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';

export type fileTypes = 'Document' | 'Image';
export type imageSize = 'Icon' | 'Image';
export const IMAGE_CONFIG = {
  Icon: { width: 128, height: 128, quality: 80 },
  Image: { width: 1280, height: 720, quality: 100 },
};

@Injectable()
export class UploadService {
  private async ensureDirectory(dir: string) {
    if (!fs.existsSync(dir)) {
      await fs.promises.mkdir(dir, { recursive: true });
    }
  }

  private async safeDelete(filePahtInsidePublic: string) {
    const filePath = path.join(process.cwd(), 'public', filePahtInsidePublic);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      return true;
    }
  }

  private getFileName(fullPath: string) {
    return path.basename(fullPath);
  }

  async uploadFile(
    file: MultipartFile,
    type: fileTypes,
    savePathInsidePublic: string,
    oldFileToDelete: string | null,
    imageSize?: imageSize,
  ) {
    let filePath: string | null = null;

    if (!file || !type || !savePathInsidePublic) {
      throw new HttpException(
        'File, type of file and save path are required',
        400,
      );
    }

    if (type === 'Image' && !imageSize) {
      throw new HttpException(
        'Image size type is required (icon or image)',
        400,
      );
    }

    await this.ensureDirectory(
      path.join(process.cwd(), 'public', savePathInsidePublic),
    );

    try {
      const buffer = await file.toBuffer();
      const originalName = file.filename;

      if (type === 'Document') {
        filePath = path.join(
          process.cwd(),
          'public',
          savePathInsidePublic,
          originalName,
        );

        await fs.promises.writeFile(filePath, buffer);

        if (
          oldFileToDelete &&
          this.getFileName(oldFileToDelete) !==
            this.getFileName(`${type}/${originalName}`)
        ) {
          await this.safeDelete(oldFileToDelete);
        }

        return originalName;
      }

      if (type === 'Image') {
        const { width, height, quality } = IMAGE_CONFIG[imageSize!];
        const ext = path.extname(originalName).toLowerCase();
        const baseName = path.parse(originalName).name;
        const fileName = `${Date.now()}-${baseName}${
          ext === '.svg' || ext === '.ico' ? ext : '.webp'
        }`;

        filePath = path.join(
          process.cwd(),
          'public',
          savePathInsidePublic,
          fileName,
        );

        if (ext === '.svg' || ext === '.ico') {
          await fs.promises.writeFile(filePath, buffer);
        } else {
          const processedImageBuffer = await sharp(buffer)
            .resize(width, height, { fit: 'inside' })
            .webp({ quality, alphaQuality: 100, effort: 4 })
            .toBuffer();
          await fs.promises.writeFile(filePath, processedImageBuffer);
        }

        if (oldFileToDelete) {
          await this.safeDelete(oldFileToDelete);
        }

        return fileName;
      }
    } catch (err) {
      if (filePath) await this.safeDelete(filePath);
      throw err;
    }
  }
}
