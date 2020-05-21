'use strict';

const imports = require('./imports');
const logger = imports.log4js.getLogger('verifyShopifyWebhook');
logger.setLevel(imports.loggerLevel);

const verifyShopifyWebhook = function(SHOPIFY_SECRET, event, context) {
    return new imports.Bluebird((resolve, reject) => {
        try {
            let digest = imports.crypto.createHmac('SHA256', SHOPIFY_SECRET)
                .update(new Buffer(event.body, 'utf8'))
                .digest('base64');
            if (digest !== event.headers['X-Shopify-Hmac-Sha256'] || event.headers['X-Shopify-Shop-Domain'] !== process.env.psShop) {
                logger.error(`  ${context.awsRequestId}  Webhook Verification Failed.`);
                reject(new Error('HMAC verification failed.'));
            } else if (digest === event.headers['X-Shopify-Hmac-Sha256'] && event.headers['X-Shopify-Shop-Domain'] === process.env.psShop) {
                logger.info(`  ${context.awsRequestId}  Webhook Verification Success.`);
                resolve(true);
            } else {
                logger.error(`  ${context.awsRequestId}  HMAC verification internal error.`);
                reject(new Error('HMAC verification Internal Error.'));
            }
        } catch (exception) {
            logger.error(`  ${context.awsRequestId}  verifyShopifyWebhook exception: ${exception}`);
            reject(exception);
        }
    });
};

const verifyShopifyAPIHMAC = function(SHOPIFY_SECRET, event, context) {
    return new imports.Bluebird((resolve, reject) => {
        try {
            //let body = "";
            let body = '&shop=' + event.queryStringParameters.shop + '&sku=' + event.queryStringParameters.sku + '&timestamp=' + event.queryStringParameters.timestamp;
            //Object.keys(event.queryStringParameters)
            //                     .forEach(queryItem=>{
            //                         body = body + '&'+[queryItem]+'='+event.queryStringParameters[queryItem];
            //                     });
            console.log(`body: ${JSON.stringify(body)}`);
            console.log(SHOPIFY_SECRET);
            let digest = imports.crypto.createHmac('SHA256', SHOPIFY_SECRET)
                .update(new Buffer(body, 'utf8'))
                .digest('base64');
            /*let hmac = imports.crypto.createHmac('SHA256', SHOPIFY_SECRET);
            console.log(`hmac:${hmac}`);
            let b = hmac;
            //let b = hmac.update(new Buffer(body, 'utf8'));
            console.log(`b:${b}`);
            let digest = b.digest('base64');*/
            console.log(`digest ${JSON.stringify(digest)}`);
            if (digest !== event.headers['X-Shopify-Hmac-Sha256'] || event.headers['X-Shopify-Shop-Domain'] !== process.env.psShop) {
                logger.info(`  ${context.awsRequestId}  Webhook Verification Failed.`);
                reject(new Error('HMAC verification failed.'));
            } else if (digest === event.headers['X-Shopify-Hmac-Sha256'] && event.headers['X-Shopify-Shop-Domain'] === process.env.psShop) {
                logger.info(`  ${context.awsRequestId}  Webhook Verification Success.`);
                resolve(true);
            } else {
                logger.info(`  ${context.awsRequestId}  HMAC verification internal error.`);
                reject(new Error('HMAC verification Internal Error.'));
            }
        } catch (exception) {
            logger.error(`  ${context.awsRequestId}  verifyShopifyWebhook exception: ${exception}`);
            reject(exception);
        }
    });
};
module.exports = {
    verifyShopifyWebhook: verifyShopifyWebhook,
    verifyShopifyAPIHMAC: verifyShopifyAPIHMAC
};