'use strict';

const imports = require('../utils/imports');
const readOrdersFromDynamo = require('./readOrdersFromDynamo');

const logger = imports.log4js.getLogger('readOrdersWorker');
logger.setLevel(imports.loggerLevel);

const readOrdersWorker = function(exclusiveStartKey, event, context) {
    let responseData = [];
    return new imports.Bluebird((resolve, reject) => {
        try {
            const recursiveReadOrders = function(exclusiveStartKey, event, context) {
                try {
                    readOrdersFromDynamo(exclusiveStartKey, event, context).then(data => {
                        responseData.push(data);
                        let key = JSON.stringify(data.LastEvaluatedKey);
                        if (key) {
                            recursiveReadOrders(data.LastEvaluatedKey, event, context);
                        } else {
                            logger.debug(`${context.awsRequestId} Calling end`);
                            resolve(responseData);
                        }
                    }).catch(err => {
                        logger.error(`  ${context.awsRequestId}  readOrdersWorker err: ${err}`);
                        reject(err);
                    });
                } catch (exception) {
                    logger.error(`  ${context.awsRequestId}  readOrdersWorker exception: ${exception}`);
                    reject(exception);
                }
            };
            recursiveReadOrders(exclusiveStartKey, event, context);
        } catch (exception) {
            logger.error(`  ${context.awsRequestId}  readOrdersWorker exception: ${exception}`);
            reject(exception);
        }
    });
};
module.exports = readOrdersWorker;