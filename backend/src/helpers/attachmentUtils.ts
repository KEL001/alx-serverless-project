import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

// TODO: Implement the fileStogare logic - Done


const XAWS = AWSXRay.captureAWS(AWS);

const BUCKET_NAME = process.env.ATTACHMENT_S3_BUCKET;
const URL_EXPIRATION = process.env.SIGNED_URL_EXPIRATION;

const targetBucket = new XAWS.S3({ signatureVersion: 'v4' });

export interface IAttachmentItem {
    uploadUrl: string
    s3SignedUrl: string,
}

export const getAttachmentUploadURL = (imageId: string): string => {
    return targetBucket.getSignedUrl('putObject', {
        Bucket: BUCKET_NAME,
        Key: imageId,
        Expires: Number(URL_EXPIRATION),
    })
}
