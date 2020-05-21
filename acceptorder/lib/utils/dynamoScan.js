'use strict';

const imports = require('./imports');
const logger = imports.log4js.getLogger('dynamoScan');
logger.setLevel(imports.loggerLevel);

const dynamoScan = function(params, context) {
    return new imports.Bluebird((resolve, reject) => {
        try {
            imports.docClient.scan(params, (err, data) => {
                if (err) {
                    logger.error(` ${context.awsRequestId}  dynamoScan error: ${err}`);
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        } catch (exception) {
            logger.error(`  ${context.awsRequestId}  dynamoScan exception: ${exception}`);
            reject(exception);
        }
    });
};
module.exports = dynamoScan;