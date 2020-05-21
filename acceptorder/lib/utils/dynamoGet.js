'use strict';

const imports = require('./imports');
const logger = imports.log4js.getLogger('dynamoGet');
logger.setLevel(imports.loggerLevel);

const dynamoGet = function(params, context) {
    return new imports.Bluebird((resolve, reject) => {
        try {
            imports.docClient.get(params, (err, data) => {
                if (err) {
                    logger.error(` ${context.awsRequestId}  dynamoGet error: ${err}`);
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        } catch (exception) {
            logger.error(`  ${context.awsRequestId}  dynamoGet exception: ${exception}`);
            reject(exception);
        }
    });
};
module.exports = dynamoGet;