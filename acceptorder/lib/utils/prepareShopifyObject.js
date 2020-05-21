'use strict';

const imports = require('./imports');
const kmsDecrypt = require('./kmsDecrypt');
const logger = imports.log4js.getLogger('prepareShopifyObject');
logger.setLevel(imports.loggerLevel);

const prepareShopifyObject = function(context) {
    return new imports.Bluebird((resolve, reject) => {
        try {
            let encryptedKeys = {};
            encryptedKeys['ShopifyApiKey'] = process.env.ShopifyApiKey;
            encryptedKeys['ShopifyAccessToken'] = process.env.ShopifyAccessToken;
            kmsDecrypt(encryptedKeys, context).then(decryptedKeys => {
                let Shopify = new imports.shopifyAPI({
                    shop: process.env.psShop,
                    shopify_api_key: decryptedKeys['ShopifyApiKey'],
                    access_token: decryptedKeys['ShopifyAccessToken'],
                    rate_limit_delay: process.env.RateLimitDelay,
                    backoff: process.env.BackOff,
                    backoff_delay: process.env.BackOffDelay,
                    verbose: false
                });
                resolve(Shopify);
            }).catch(err => {
                logger.error(`  ${context.awsRequestId}  prepareShopifyObject err: ${err}`);
                reject(err);
            });
        } catch (exception) {
            logger.error(`  ${context.awsRequestId}  prepareShopifyObject exception: ${exception}`);
            reject(exception);
        }
    });
};
module.exports = prepareShopifyObject;