'use strict';

const imports = require('./imports');
const logger = imports.log4js.getLogger('simpleNotificationService');
logger.setLevel(imports.loggerLevel);

const simpleNotificationService = function(params, context) {
    return new imports.Bluebird((resolve, reject) => {
        try {
            imports.SNS.publish(params, (err, data) => {
                if (err) {
                    logger.error(` ${context.awsRequestId}  simpleNotificationService error: ${err}`);
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        } catch (exception) {
            logger.error(`  ${context.awsRequestId}  simpleNotificationService exception: ${exception}`);
            reject(exception);
        }
    });
};
module.exports = simpleNotificationService;