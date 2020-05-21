'use strict';

const imports = require('./imports');
const logger = imports.log4js.getLogger('prepareDynamoOrdersForS3');
logger.setLevel(imports.loggerLevel);

const prepareDynamoOrdersForS3 = function(dynamoOrders, context) {
    return new imports.Bluebird((resolve, reject) => {
        try {
            let listOfDynamoOrders = [];
            for (let i = 0; i < dynamoOrders.length; i++) {
                for (let j = 0; j < dynamoOrders[i].Items.length; j++) {
                    listOfDynamoOrders.push(dynamoOrders[i].Items[j]);
                }
            }
            resolve(listOfDynamoOrders);
        } catch (exception) {
            logger.error(`  ${context.awsRequestId}  prepareDynamoOrdersForS3 exception: ${exception}`);
            reject(exception);
        }
    });
};
module.exports = prepareDynamoOrdersForS3;