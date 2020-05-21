'use strict';

const imports = require('./imports');
const getRecordSize = require('./getRecordSize');
const logger = imports.log4js.getLogger('productKinesisPutRecord');
logger.setLevel(imports.loggerLevel);

const productKinesisPutRecord = function(data, context) {
    return new imports.Bluebird((resolve, reject) => {
        try {
            const kinesisStreamName = process.env.KinesisStream;
            // logger.debug(`kinesis data: ${JSON.stringify(data)}`);
            let body = JSON.parse(data.body);
            let id = (body.id).toString();
            let pKey = String('partitionKey-').concat(id);
            let params = {
                Data: JSON.stringify(data),
                PartitionKey: pKey,
                StreamName: kinesisStreamName
            };
            let recordSize = getRecordSize(params);
            logger.debug(`messageSize: ${recordSize}`);
            logger.debug(`KINESIS_MAX_PAYLOAD_BYTES: ${imports.KINESIS_MAX_PAYLOAD_BYTES}`);
            if (recordSize <= imports.KINESIS_MAX_PAYLOAD_BYTES) {
                imports.kinesis.putRecord(params, function(err, data) {
                    if (err) {
                        logger.error(`  ${context.awsRequestId}  decrypt error: ${err}`);
                        reject(err);
                    } else {
                        logger.info(`  ${context.awsRequestId}  Kinesis process record success`);
                        resolve(data);
                    }
                });
            } else {
                logger.debug('message size more than KINESIS_MAX_PAYLOAD_BYTES, saving message to S3 for further analysis');
                //Save event data in S3
                //Create filename
                let filename = kinesisStreamName + '/error/MaxSize/' + id.toString() + '_' + recordSize.toString() + '_' + imports.moment().toISOString() + '.json';
                logger.debug(`filename: ${filename}`);
                var s3 = new imports.AWS.S3();
                let params = {
                    Bucket: process.env.S3Bucket,
                    Key: filename,
                    Body: data
                };
                s3.putObject(params, function(err, data) {
                    if (err) {
                        logger.error(`  ${context.awsRequestId}  productKinesisPutRecord err: ${err.stack}`);
                    } else {
                        //logger.debug(`Successfully uploaded  ${filename} to ${process.env.S3Bucket} for futher analysis`);
                        logger.debug('Successfully uploaded file for futher analysis');
                    }
                });
            }
        } catch (exception) {
            logger.error(`  ${context.awsRequestId}  productKinesisPutRecord exception: ${exception}`);
            reject(exception);
        }
    });
};
module.exports = productKinesisPutRecord;