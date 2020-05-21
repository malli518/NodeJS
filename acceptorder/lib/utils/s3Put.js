'use strict';

const imports = require('./imports');
const logger = imports.log4js.getLogger('s3Put');
logger.setLevel(imports.loggerLevel);

const s3Put = function(data, filename, extension, context) {
    return new imports.Bluebird((resolve, reject) => {
        try {
            let prepareFilename = 'dynamoOrders/' + filename + '.' + extension;
            let s3 = new imports.AWS.S3();
            let params = {
                Bucket: process.env.S3Bucket,
                Key: prepareFilename,
                Body: data
            };
            s3.putObject(params, function(err, success) {
                if (err) {
                    logger.error(` ${context.awsRequestId}  s3Put error: ${err}`);
                    reject(err);
                } else {
                    resolve(success);
                }
            });
        } catch (exception) {
            logger.error(`  ${context.awsRequestId}  s3Put exception: ${exception}`);
            reject(exception);
        }
    });
};
module.exports = s3Put;