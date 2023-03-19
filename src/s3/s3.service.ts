import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class S3Service {
  private s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
      signatureVersion: 'v4',
    });
  }

  async uploadImage(
    buffer: Buffer,
    mimetype: string,
    key: string,
  ): Promise<string | undefined> {
    const params: AWS.S3.PutObjectRequest = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
      ServerSideEncryption: 'aws:kms',
    };

    await this.s3.upload(params).promise();

    return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;
  }

  async getSignedUrl(key: string): Promise<string> {
    const params: AWS.S3.GetObjectRequest = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    };

    return this.s3.getSignedUrlPromise('getObject', params);
  }

  async deleteImage(key: string): Promise<void> {
    // list all object versions
    const listObjectVersionsParams: AWS.S3.ListObjectVersionsRequest = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Prefix: key,
    };

    // get all versions of the object
    const { Versions } = await this.s3
      .listObjectVersions(listObjectVersionsParams)
      .promise();

    // if versions exist, delete all versions
    if (Versions) {
      for (const version of Versions) {
        const deleteObjectParams: AWS.S3.DeleteObjectRequest = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
          VersionId: version.VersionId,
        };
        await this.s3.deleteObject(deleteObjectParams).promise();
      }
    }

    const params: AWS.S3.DeleteObjectRequest = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    };

    await this.s3.deleteObject(params).promise();
  }

  // list all objects in a given prefix
  async listObjects(prefix: string): Promise<AWS.S3.Object[]> {
    const params: AWS.S3.ListObjectsV2Request = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Prefix: prefix,
    };

    const { Contents } = await this.s3.listObjectsV2(params).promise();
    return Contents || [];
  }

  async copyObject(sourceKey: string, destinationKey: string): Promise<void> {
    const params: AWS.S3.CopyObjectRequest = {
      Bucket: process.env.AWS_BUCKET_NAME,
      CopySource: `${process.env.AWS_BUCKET_NAME}/${sourceKey}`,
      Key: destinationKey,
    };

    await this.s3.copyObject(params).promise();
  }

  // delete folder
  async deleteFolder(folderPath: string): Promise<void> {
    const params: AWS.S3.DeleteObjectRequest = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: folderPath,
    };

    await this.s3.deleteObject(params).promise();
  }
}
