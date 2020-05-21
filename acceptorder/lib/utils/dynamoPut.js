'use strict';

const imports = require('./imports');
const logger = imports.log4js.getLogger('dynamoPut');
logger.setLevel(imports.loggerLevel);

const dynamoPut = function(params, context) {
    return new imports.Bluebird((resolve, reject) => {
        try {
            imports.docClient.put(params, (err, data) => {
                if (err) {
                    logger.error(` ${context.awsRequestId}  dynamoPut error: ${err}`);
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        } catch (exception) {
            logger.error(`  ${context.awsRequestId}  dynamoPut exception: ${exception}`);
            reject(exception);
        }
    });
};
module.exports = dynamoPut;