'use strict';

const imports = require('../utils/imports');
const dynamoScan = require('../utils/dynamoScan');

const logger = imports.log4js.getLogger('readOrdersFromDynamo');
logger.setLevel(imports.loggerLevel);

const readOrdersFromDynamo = function(exclusiveStartKey, event, context) {
    return new imports.Bluebird((resolve, reject) => {
        let params;
        try {
            let createdDate = process.env.createdDate;
            params = {
                TableName: process.env.OrdersTableName,
                FilterExpression: 'ShopifyCreatedDate = :shopifyCreatedDate',
                ExpressionAttributeValues: { ':shopifyCreatedDate': createdDate },
                //Limit: 100,
                ExclusiveStartKey: exclusiveStartKey
            };
            dynamoScan(params, context).then(data => {
                resolve(data);
            }).catch(err => {
                logger.error(`  ${context.awsRequestId}  readOrdersFromDynamo  err: ${err}`);
                reject(err);
            });
        } catch (exception) {
            logger.error(`  ${context.awsRequestId}  readOrdersFromDynamo exception: ${exception}`);
            reject(exception);
        }
    });
};
module.exports = readOrdersFromDynamo;