'use strict';

const imports = require('./imports');
const logger = imports.log4js.getLogger('dynamoQuery');
logger.setLevel(imports.loggerLevel);

const dynamoQuery = function(params, context) {
    return new imports.Bluebird((resolve, reject) => {
        try {
            imports.docClient.query(params, (err, data) => {
                if (err) {
                    logger.error(` ${context.awsRequestId}  dynamoQuery error: ${err}`);
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        } catch (exception) {
            logger.error(`  ${context.awsRequestId}  dynamoQuery exception: ${exception}`);
            reject(exception);
        }
    });
};
module.exports = dynamoQuery;