import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

export function UploadFileS3(fileName: string) {
  return class UploadUtility extends FileInterceptor(fileName, {
    storage: memoryStorage(),
  }) {};
}
