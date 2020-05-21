'use strict';

const imports = require('./lib/utils/imports');
const responseCodes = require('./lib/utils/responseCodes');
const prepareResponse = require('./lib/utils/response').prepareResponse;
const kmsDecrypt = require('./lib/utils/kmsDecrypt');
const verifyShopifyWebhook = require('./lib/utils/verifyShopifyWebhook').verifyShopifyWebhook;
const kinesisPutRecord = require('./lib/utils/kinesisPutRecord');
const logger = imports.log4js.getLogger('postContact');
logger.setLevel(imports.loggerLevel);

/*Catch the shopify contact details and post it into kinesis */
module.exports.postContact = (event, context, callback) => {
    //logger.debug(`event: ${JSON.stringify(event)}`);
    //logger.debug(`context ${JSON.stringify(context)}`);
    let response;
    let contactId;
    try {
        contactId = JSON.parse(event.body).id;
        let encryptedKeys = {};
        encryptedKeys['SHOPIFY_SECRET'] = process.env.ShopifySecret;
        //call kmsDecrypt for SHOPIFY_SECRET
        kmsDecrypt(encryptedKeys, context)
            .then(function(decryptedKeys) {
                logger.debug(`  ${context.awsRequestId} - ContactId : ${contactId} - Successfully decrypted Shopify Secret`);
                //call verifyShopifyWebhook
                verifyShopifyWebhook(decryptedKeys['SHOPIFY_SECRET'], event, context)
                    .then(function(success) {
                        logger.debug(`  ${context.awsRequestId} - ContactId : ${contactId} - shopify verification success. ${success}`);
                        //call kinesisPutRecord
                        kinesisPutRecord(event.body, context)
                            .then(function(data) {
                                response = prepareResponse(responseCodes.SUCCESS, data, event);
                                return callback(null, response);
                            })
                            .catch(function(kinesisPutErr) {
                                logger.error(`  ${context.awsRequestId} - ContactId : ${contactId} - kinesisPutRecord  error: ${kinesisPutErr}`);
                                response = prepareResponse(responseCodes.INTERNALERROR, kinesisPutErr.message, event);
                                return callback(null, response);
                            });
                    })
                    .catch(function(hmacVerfErr) {
                        logger.debug(`  ${context.awsRequestId} - ContactId : ${contactId} - HMAC verification failed.`);
                        //prepare response object
                        response = prepareResponse(responseCodes.UNAUTHORISED, hmacVerfErr.message, event);
                        return callback(null, response);
                    });
            })
            .catch(function(kmsErr) {
                logger.error(`  ${context.awsRequestId} - ContactId : ${contactId} -  decrypt error: ${kmsErr}`);
                response = prepareResponse(responseCodes.INTERNALERROR, kmsErr.message, event);
                return callback(null, response);
            });
    } catch (exception) {
        logger.error(`  ${context.awsRequestId} - ContactId : ${contactId} - exception: ${exception}`);
        response = prepareResponse(responseCodes.INTERNALERROR, exception.message, event);
        return callback(null, response);
    }
};