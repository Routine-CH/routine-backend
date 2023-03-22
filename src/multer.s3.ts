import { Request } from 'express';
import * as multer from 'multer';
import * as multerS3 from 'multer-s3';
import { v4 as uuid } from 'uuid';
import { Bucket, s3 } from './aws.s3';

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  buffer: Buffer;
}

export const multerS3Config = multer({
  storage: multerS3({
    s3,
    bucket: Bucket,
    acl: 'public-read',
    key: (
      req: Request,
      file: MulterFile,
      cb: (error: Error | null, key?: string) => void,
    ) => {
      cb(null, `images/${uuid()}.${file.mimetype.split('/')[1]}`);
    },
  }),
});
