'use strict';

const imports = require('./imports');
const logger = imports.log4js.getLogger('dynamoDelete');
logger.setLevel(imports.loggerLevel);

const dynamoDelete = function(params, context) {
    return new imports.Bluebird((resolve, reject) => {
        try {
            imports.docClient.delete(params, (err, data) => {
                if (err) {
                    logger.error(` ${context.awsRequestId}  dynamoDelete error: ${err}`);
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        } catch (exception) {
            logger.error(`  ${context.awsRequestId}  dynamoDelete exception: ${exception}`);
            reject(exception);
        }
    });
};
module.exports = dynamoDelete;