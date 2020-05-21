'use strict';

const imports = require('./imports');
const logger = imports.log4js.getLogger('shopifyPut');
logger.setLevel(imports.loggerLevel);

const shopifyPut = function(Shopify, shopifyUrl, query_data, context) {
    return new imports.Bluebird((resolve, reject) => {
        try {
            Shopify.put(shopifyUrl, query_data, function(err, data) {
                if (err) {
                    logger.error(`  ${context.awsRequestId}  shopifyPut error: ${err}`);
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        } catch (exception) {
            logger.error(`  ${context.awsRequestId}  shopifyPut exception: ${exception}`);
            reject(exception);
        }
    });
};
module.exports = shopifyPut;