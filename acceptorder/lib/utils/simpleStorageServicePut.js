'use strict';

const imports = require('./imports');
const logger = imports.log4js.getLogger('simpleStorageServicePut');
logger.setLevel(imports.loggerLevel);

const simpleStorageServicePut = function(params, context) {
    return new imports.Bluebird((resolve, reject) => {
        try {
            let s3 = new imports.AWS.S3();
            s3.putObject(params, function(err, data) {
                if (err) {
                    logger.error(` ${context.awsRequestId}  simpleStorageServicePut error: ${err}`);
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        } catch (exception) {
            logger.error(`  ${context.awsRequestId}  simpleStorageServicePut exception: ${exception}`);
            reject(exception);
        }
    });
};
module.exports = simpleStorageServicePut;