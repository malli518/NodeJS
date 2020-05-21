'use strict';

const imports = require('./imports');
const logger = imports.log4js.getLogger('simpleEmailService');
logger.setLevel(imports.loggerLevel);

const simpleEmailService = function(params, context) {
    return new imports.Bluebird((resolve, reject) => {
        try {
            imports.SES.sendEmail(params, (err, data) => {
                if (err) {
                    logger.error(` ${context.awsRequestId}  simpleEmailService error: ${err}`);
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        } catch (exception) {
            logger.error(`  ${context.awsRequestId}  simpleEmailService exception: ${exception}`);
            reject(exception);
        }
    });
};
module.exports = simpleEmailService;