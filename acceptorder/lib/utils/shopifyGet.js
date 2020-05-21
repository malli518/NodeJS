'use strict';

const imports = require('./imports');
const logger = imports.log4js.getLogger('shopifyGet');
logger.setLevel(imports.loggerLevel);

const shopifyGet = function(Shopify, shopifyUrl, query_data, context) {
    return new imports.Bluebird((resolve, reject) => {
        try {
            Shopify.get(shopifyUrl, query_data, function(err, data) {
                if (err) {
                    logger.error(`  ${context.awsRequestId}  shopifyGet error: ${err}`);
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        } catch (exception) {
            logger.error(`  ${context.awsRequestId}  shopifyGet exception: ${exception}`);
            reject(exception);
        }
    });
};
module.exports = shopifyGet;