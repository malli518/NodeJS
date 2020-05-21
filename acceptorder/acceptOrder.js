'use strict';
const imports = require('./lib/utils/imports');
const responseCodes = require('./lib/utils/responseCodes');
const prepareResponse = require('./lib/utils/response').prepareResponse;
const kmsDecrypt = require('./lib/utils/kmsDecrypt');
const verifyShopifyWebhook = require('./lib/utils/verifyShopifyWebhook').verifyShopifyWebhook;
const kinesisPutRecord = require('./lib/utils/kinesisPutRecord');
const simpleNotificationService = require('./lib/utils/simpleNotificationService');

const logger = imports.log4js.getLogger('postOrder');
logger.setLevel(imports.loggerLevel);

/*Catch the shopify order details and post it into kinesis */
module.exports.postOrder = (event, context, callback) => {
    logger.debug(`event: ${JSON.stringify(event.body)}`);
    //logger.debug(`context ${JSON.stringify(context)}`);
    let response;
    let orderId;
    try {
        orderId = JSON.parse(event.body).id;
        let encryptedKeys = {};
        encryptedKeys['SHOPIFY_SECRET'] = process.env.ShopifySecret;
        //call kmsDecrypt for SHOPIFY_SECRET
        kmsDecrypt(encryptedKeys, context)
            .then(decryptedKeys => {
                logger.debug(`  ${context.awsRequestId} - OrderId : ${orderId} - Successfully decrypted Shopify Secret`);
                return verifyShopifyWebhook(decryptedKeys['SHOPIFY_SECRET'], event, context);
            })
            .then(success => {
                logger.debug(`  ${context.awsRequestId} - OrderId : ${orderId} - shopify verification success. ${success}`);
                return kinesisPutRecord(event.body, context);
            })
            .then(data => {
                response = prepareResponse(responseCodes.SUCCESS, data, event);
                return callback(null, response);
            })
            .catch(err => {
                logger.error(`  ${context.awsRequestId} - OrderId : ${orderId} - error: ${err}`);
                let subject = 'AcceptOrder - ' + err.message;
                let params = {
                    TargetArn: process.env.AcceptOrderErrorSubscription,
                    Message: err.stack,
                    Subject: subject
                };
                simpleNotificationService(params, context).then(success => {
                    logger.debug(` ${context.awsRequestId} - OrderId : ${orderId} - SNS success ${JSON.stringify(success)}`);
                }).catch(function(snsErr) {
                    logger.error(`  ${context.awsRequestId} - OrderId : ${orderId} - error: ${snsErr}`);
                });
                response = prepareResponse(responseCodes.INTERNALERROR, err.message, event);
                return callback(null, response);
            });
    } catch (exception) {
        logger.error(`  ${context.awsRequestId} - OrderId : ${orderId} - exception: ${exception}`);
        let subject = 'AcceptOrder - ' + exception.message;
        let params = {
            TargetArn: process.env.AcceptOrderErrorSubscription,
            Message: exception.stack,
            Subject: subject
        };
        simpleNotificationService(params, context).then(success => {
            logger.debug(` ${context.awsRequestId} - OrderId : ${orderId} - SNS success ${JSON.stringify(success)}`);
        }).catch(function(snsErr) {
            logger.error(`  ${context.awsRequestId} - OrderId : ${orderId} - error: ${snsErr}`);
        });
        response = prepareResponse(responseCodes.INTERNALERROR, exception.message, event);
        return callback(null, response);
    }
};