'use strict';

const imports = require('./imports');
const logger = imports.log4js.getLogger('prepareDynamoOrders');
logger.setLevel(imports.loggerLevel);

const prepareDynamoOrders = function(dynamoOrders, context) {
    return new imports.Bluebird((resolve, reject) => {
        try {
            let dynamoOrderIds = [];
            for (let i = 0; i < dynamoOrders.length; i++) {
                for (let j = 0; j < dynamoOrders[i].Items.length; j++) {
                    dynamoOrderIds.push(dynamoOrders[i].Items[j].OrderId);
                }
            }
            resolve(dynamoOrderIds);
        } catch (exception) {
            logger.error(`  ${context.awsRequestId}  prepareDynamoOrders exception: ${exception}`);
            reject(exception);
        }
    });
};
module.exports = prepareDynamoOrders;