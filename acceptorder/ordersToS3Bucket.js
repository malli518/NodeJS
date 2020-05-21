'use strict';

const imports = require('./lib/utils/imports');
const responseCodes = require('./lib/utils/responseCodes');
const prepareResponse = require('./lib/utils/response').prepareResponse;
const readOrdersWorker = require('./lib/services/readOrdersWorker');
const prepareDynamoOrdersForS3 = require('./lib/utils/prepareDynamoOrdersForS3');
const s3Put = require('./lib/utils/s3Put');

const logger = imports.log4js.getLogger('ordersToS3Bucket');
logger.setLevel(imports.loggerLevel);

module.exports.ordersToS3Bucket = (event, context, callback) => {
    let response;
    try {
        readOrdersWorker(null, event, context).then(dynamoOrders => {
            prepareDynamoOrdersForS3(dynamoOrders, context).then(listOfDynamoOrders => {
                logger.debug(`${context.awsRequestId} ListOfDynamoOrders length : ${listOfDynamoOrders.length} `);
                let createdDate = process.env.createdDate;
                if (listOfDynamoOrders.length > 0) {
                    let csvDynaoOrders = imports.json2csv({ data: listOfDynamoOrders });
                    s3Put(csvDynaoOrders, createdDate, 'csv', context).then(success => {
                        logger.debug(`${context.awsRequestId} Mesages are processed`);
                        response = prepareResponse(responseCodes.SUCCESS, 'Messages are processed', event);
                        return callback(null, response);
                    }).catch(err => {
                        logger.error(`${context.awsRequestId}  s3Put  exception: ${err}`);
                        response = prepareResponse(responseCodes.INTERNALERROR, err.message, event);
                        return callback(null, response);
                    });
                } else {
                    logger.debug(`${context.awsRequestId} No messages to process`);
                    response = prepareResponse(responseCodes.SUCCESS, 'No Messages to process', event);
                    return callback(null, response);
                }
            });
        }).catch(err => {
            logger.error(`${context.awsRequestId}  ordersToS3Bucket  exception: ${err}`);
            response = prepareResponse(responseCodes.INTERNALERROR, err.message, event);
            return callback(null, response);
        });
    } catch (exception) {
        logger.error(`${context.awsRequestId}  ordersToS3Bucket  exception: ${exception}`);
        response = prepareResponse(responseCodes.INTERNALERROR, exception.message, event);
        return callback(null, response);
    }
};