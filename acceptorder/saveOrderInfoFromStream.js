'use strict';
const imports = require('./lib/utils/imports');
const simpleStorageServicePut = require('./lib/utils/simpleStorageServicePut');

const logger = imports.log4js.getLogger('saveOrderInfo');
logger.setLevel(imports.loggerLevel);

logger.debug('Loading saveOrderInfo function');

module.exports.saveOrderInfo = (event, context, callback) => {
    logger.debug(`event: ${JSON.stringify(event)}`);
    try {
        event.Records.forEach((record) => {
            // Kinesis data is base64 encoded so decode here
            const payload = new Buffer(record.kinesis.data, 'base64').toString('utf8');
            logger.debug(`payload:${payload}`);
            let payloadObj = JSON.parse(payload);
            //Save event data in S3
            //append Sequence no and Shard to Contact Id
            let filename = 'orders/' + (payloadObj.id).toString() + '_' + record.eventID + '.json';
            let params = {
                Bucket: process.env.S3Bucket,
                Key: filename,
                Body: payload
            };
            simpleStorageServicePut(params, context).then(data => {
                logger.debug(`${context.awsRequestId} Successfully uploaded data to myBucket/orders`);
                callback(null, `Successfully processed ${event.Records.length} records.`);
            }).catch(err => {
                logger.error(`${context.awsRequestId} error: ${err} `);
                return callback(err);
            });
        });
    } catch (exception) {
        logger.error(`${context.awsRequestId} exception: ${exception} `);
        return callback(exception.message);
    }
};