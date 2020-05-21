'use strict';

const imports = require('./lib/utils/imports');

const logger = imports.log4js.getLogger('postOrder');
logger.setLevel(imports.loggerLevel);

logger.debug('Loading function');

module.exports.getContactInfoFromStream = (event, context, callback) => {
    logger.debug(`${context.awsRequestId} event: ${JSON.stringify(event)}`);
    event.Records.forEach((record) => {
        // Kinesis data is base64 encoded so decode here
        const payload = new Buffer(record.kinesis.data, 'base64').toString('ascii');
        logger.debug(`${context.awsRequestId} payload:${payload}`);
        let payloadObj = JSON.parse(payload);
        //Save event data in S3
        //append Sequence no and Shard to Contact Id
        let filename = 'contacts/' + (payloadObj.id).toString() + '_' + record.eventID.replace(':', '_') + '.json';
        var s3 = new imports.AWS.S3();
        var params = {
            Bucket: process.env.S3Bucket,
            Key: filename,
            Body: payload
        };
        s3.putObject(params, function(err, data) {
            if (err) {
                logger.error(err.stack);
            } else {
                logger.debug(`${context.awsRequestId} Successfully uploaded data to myBucket/contacts`);
            }
        });
    });
    callback(null, `Successfully processed ${event.Records.length} records.`);
};