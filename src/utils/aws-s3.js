/**
 * Module dependencies.
 */
import AWS from 'aws-sdk';
import mime from 'mime';

/**
 * Import Utilities
 */
import { awsSecrets } from '../config/index.js';

const S3 = new AWS.S3({
	accessKeyId: awsSecrets.accessKeyId,
	secretAccessKey: awsSecrets.secretAccessKey,
	region: awsSecrets.region,
	correctClockSkew: true,
	signatureVersion: 'v4',
});

/**
 * Upload file to s3
 * @param {Buffer} fileBuffer file buffer to upload on s3
 * @param {object} options
 * @param {string} options.folderPath folder path
 * @param {string} options.fileName file name
 * @param {string} options.fileType file extension
 * @param {Boolean} options.isAuto To check that file is uploaded by system or person
 * @param {string} options.bucket
 * @param {string} options.acl
 * @returns {Promise<string>}
 */
export const uploadFile = (fileBuffer, options = {}) => {
	return new Promise((resolve, reject) => {
		try {
			if (!Buffer.isBuffer(fileBuffer)) {
				resolve(null);
				return;
			}

			let { folderPath = '/', bucket, acl, fileName = null } = options;
			const { fileType = 'jpeg' } = options;

			const extension = /^\./.test(fileType) ? fileType : `.${fileType}`;
			folderPath = /\/$/.test(folderPath) ? folderPath : `${folderPath}/`;

			bucket ??= awsSecrets.s3.bucket;
			acl ??= awsSecrets.s3.acl;

			fileName = fileName || `${Date.now()}`;

			const params = {
				Bucket: bucket,
				ACL: acl,
				Body: fileBuffer,
				ContentType: mime.getType(extension),
				Key: folderPath + fileName + extension,
			};

			const fileUri = `${params.Key}`;

			S3.putObject(params)
				.promise()
				.then(() => {
					resolve(fileUri);
				})
				.catch(err => {
					reject(err);
				});
		} catch (error) {
			reject(error);
		}
	});
};
