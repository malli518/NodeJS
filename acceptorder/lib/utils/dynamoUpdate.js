'use strict';

const imports = require('./imports');
const logger = imports.log4js.getLogger('dynamoUpdate');
logger.setLevel(imports.loggerLevel);

const dynamoUpdate = function(params, context) {
    return new imports.Bluebird((resolve, reject) => {
        try {
            imports.docClient.update(params, (err, data) => {
                if (err) {
                    logger.error(` ${context.awsRequestId}  dynamoUpdate error: ${err}`);
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        } catch (exception) {
            logger.error(`  ${context.awsRequestId}  dynamoUpdate exception: ${exception}`);
            reject(exception);
        }
    });
};
module.exports = dynamoUpdate;