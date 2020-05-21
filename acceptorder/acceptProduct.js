'use strict';
const imports = require('./lib/utils/imports');
const responseCodes = require('./lib/utils/responseCodes');
const prepareResponse = require('./lib/utils/response').prepareResponse;
const kmsDecrypt = require('./lib/utils/kmsDecrypt');
const verifyShopifyWebhook = require('./lib/utils/verifyShopifyWebhook').verifyShopifyWebhook;
const productKinesisPutRecord = require('./lib/utils/productKinesisPutRecord');

const logger = imports.log4js.getLogger('postProduct');
logger.setLevel(imports.loggerLevel);

/*Catch the shopify product details and post it into kinesis */
module.exports.postProduct = (event, context, callback) => {
    logger.debug(`event: ${JSON.stringify(event.body)}`);
    //logger.debug(`context ${JSON.stringify(context)}`);
    let response;
    let productId;
    try {
        productId = JSON.parse(event.body).id;
        let encryptedKeys = {};
        encryptedKeys['SHOPIFY_SECRET'] = process.env.ShopifySecret;
        //call kmsDecrypt for SHOPIFY_SECRET
        kmsDecrypt(encryptedKeys, context)
            .then(function(decryptedKeys) {
                logger.debug(`  ${context.awsRequestId} - ProductId : ${productId} - Successfully decrypted Shopify Secret`);
                //call verifyShopifyWebhook
                verifyShopifyWebhook(decryptedKeys['SHOPIFY_SECRET'], event, context)
                    .then(function(success) {
                        logger.info(`  ${context.awsRequestId} - ProductId : ${productId} - shopify verification success. ${success}`);
                        //call kinesisPutRecord
                        productKinesisPutRecord(event, context)
                            .then(function(data) {
                                response = prepareResponse(responseCodes.SUCCESS, data, event);
                                return callback(null, response);
                            })
                            .catch(function(kinesisPutErr) {
                                logger.error(`  ${context.awsRequestId} - ProductId : ${productId} -  kinesisPutRecord  error: ${kinesisPutErr}`);
                                response = prepareResponse(responseCodes.INTERNALERROR, kinesisPutErr, event);
                                return callback(null, response);
                            });
                    })
                    .catch(function(hmacVerfErr) {
                        logger.info(`  ${context.awsRequestId} - ProductId : ${productId} - HMAC verification failed.`);
                        //prepare response object
                        response = prepareResponse(responseCodes.UNAUTHORISED, hmacVerfErr.message, event);
                        return callback(null, response);
                    });
            })
            .catch(function(kmsErr) {
                logger.error(`  ${context.awsRequestId} - ProductId : ${productId} - decrypt error: ${kmsErr}`);
                response = prepareResponse(responseCodes.INTERNALERROR, 'Decryption Error', event);
                return callback(null, response);
            });
    } catch (exception) {
        logger.error(`  ${context.awsRequestId} - ProductId : ${productId} - postProduct  exception: ${exception}`);
        response = prepareResponse(responseCodes.INTERNALERROR, exception.message, event);
        return callback(null, response);
    }
};