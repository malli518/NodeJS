'use strict';

const imports = require('./imports');
const logger = imports.log4js.getLogger('prepareShopifyOrders');
logger.setLevel(imports.loggerLevel);

const prepareShopifyOrders = function(shopifyOrders, context) {
    return new imports.Bluebird((resolve, reject) => {
        try {
            let shopifyOrderIds = [];
            for (let i = 0; i < shopifyOrders.length; i++) {
                for (let j = 0; j < shopifyOrders[i].orders.length; j++) {
                    shopifyOrderIds.push(shopifyOrders[i].orders[j].id);
                }
            }
            resolve(shopifyOrderIds);
        } catch (exception) {
            logger.error(`  ${context.awsRequestId}  prepareShopifyOrders exception: ${exception}`);
            reject(exception);
        }
    });
};
module.exports = prepareShopifyOrders;