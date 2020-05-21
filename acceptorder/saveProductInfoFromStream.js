'use strict';
const imports = require('./lib/utils/imports');
const simpleStorageServicePut = require('./lib/utils/simpleStorageServicePut');

const logger = imports.log4js.getLogger('saveProductInfo');
logger.setLevel(imports.loggerLevel);

logger.debug('Loading saveProductInfo function');

module.exports.saveProductInfo = (event, context, callback) => {
    logger.debug(`event: ${JSON.stringify(event)}`);
    try {
        event.Records.forEach((record) => {
            // Kinesis data is base64 encoded so decode here
            const payload = new Buffer(record.kinesis.data, 'base64').toString('utf8');
            logger.debug(`${context.awsRequestId} Payload from kinesis stream ${payload} `);
            let payloadEvent = JSON.parse(payload);
            let payloadObj = JSON.parse(payloadEvent.body);
            let header = payloadEvent.headers['X-Shopify-Topic'];
            let headerValue = header.split('/').map(function(val) {
                return val;
            });
            let operationType = 'UNDEFINED';
            if (headerValue[1]) {
                operationType = headerValue[1];
            }
            let productId = (payloadObj.id).toString();
            let currentDate = imports.moment().format(imports.dateTimeFormatT);
            //Save event data in S3
            //append Sequence no and Shard to Contact Id
            let filename = 'products/' + productId + '/' + record.eventID + '_' + currentDate + '_' + operationType + '.json';
            let params = {
                Bucket: process.env.S3Bucket,
                Key: filename,
                Body: JSON.stringify(payloadObj)
            };
            simpleStorageServicePut(params, context).then(data => {
                logger.debug(`${context.awsRequestId} Successfully uploaded data to myBucket/products`);
                callback(null, `Successfully processed ${event.Records.length} records.`);
            }).catch(err => {
                logger.error(`${context.awsRequestId} error: ${err}`);
                return callback(err);
            });
        });
    } catch (exception) {
        logger.error(`${context.awsRequestId} exception: ${exception}`);
        return callback(exception.message);
    }
};