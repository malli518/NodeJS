'use strict';

const imports = require('./lib/utils/imports');
const responseCodes = require('./lib/utils/responseCodes');
const prepareResponse = require('./lib/utils/response').prepareResponse;
const dynamoPut = require('./lib/utils/dynamoPut');
const shopifyMissingOrders = require('./lib/services/shopifyMissingOrders');
const processMissingOrders = require('./lib/services/processMissingOrders');

const logger = imports.log4js.getLogger('getOrdersFromShopify');
logger.setLevel(imports.loggerLevel);

module.exports.getOrdersFromShopify = (event, context, callback) => {
    let response;
    try {
        shopifyMissingOrders(event, context)
            .then(shopifyMissingOrdersPromise => {
                let missingOrdersCount = shopifyMissingOrdersPromise['missingOrders'].length;
                let shopifyScheduleDates = shopifyMissingOrdersPromise['scheduleDates'];
                let Shopify = shopifyMissingOrdersPromise['Shopify'];
                logger.debug(`${context.awsRequestId} missingOrdersCount :  ${missingOrdersCount} `);
                if (missingOrdersCount === 0) {
                    logger.info(`${context.awsRequestId} There are no missing orders....`);
                    let params = {
                        TableName: process.env.AuditSchedulerTableName,
                        Item: {
                            'Id': event.scheduleOrderName,
                            'LastRunDate': shopifyScheduleDates['lastRunDate'],
                            'ScheduleFromDate': shopifyScheduleDates['scheduleFromDate'],
                            'ScheduleToDate': shopifyScheduleDates['scheduleToDate']
                        }
                    };
                    dynamoPut(params, context)
                        .then(success => {
                            logger.debug(`${context.awsRequestId} success :  ${success} `);
                            response = prepareResponse(responseCodes.SUCCESS, 'Messages are processed', event);
                            return callback(null, response);
                        });
                } else {
                    logger.info(`${context.awsRequestId} Process missing orders`);
                    processMissingOrders(Shopify, shopifyMissingOrdersPromise['missingOrders'], shopifyScheduleDates, event, context)
                        .then(response => {
                            response = prepareResponse(responseCodes.SUCCESS, 'Messages are processed', event);
                            return callback(null, response);
                        });
                }
            })
            .catch(function(err) {
                logger.error(`${context.awsRequestId} error : ${err} `);
                response = prepareResponse(responseCodes.INTERNALERROR, err.stack, event);
                return callback(null, response);
            });
    } catch (exception) {
        logger.error(`${context.awsRequestId} exception: ${exception} `);
        response = prepareResponse(responseCodes.INTERNALERROR, exception.message, event);
        return callback(null, response);
    }
};