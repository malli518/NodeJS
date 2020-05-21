'use strict';

const imports = require('./lib/utils/imports');
const prepareProduct = require('./lib/utils/prepareProduct');
const shopifyGet = require('./lib/utils/shopifyGet');
const processProductData = require('./lib/services/processProductData');
const dynamoGet = require('./lib/utils/dynamoGet');
const dynamoDelete = require('./lib/utils/dynamoDelete');
const prepareShopifyObject = require('./lib/utils/prepareShopifyObject');

const logger = imports.log4js.getLogger('getProductInfoFromStream');
logger.setLevel(imports.loggerLevel);
logger.debug('Loading getProductInfoFromStream function');

module.exports.getProductInfoFromStream = (event, context, callback) => {
    logger.debug(`${context.awsRequestId} event: ${JSON.stringify(event)}`);
    event.Records.forEach((record) => {
        // Kinesis data is base64 encoded so decode here
        try {
            const payload = new Buffer(record.kinesis.data, 'base64').toString('utf8');
            logger.debug(`${context.awsRequestId} Payload from kinesis stream ${payload} `);
            let payloadEvent = JSON.parse(payload);
            let payloadObj = JSON.parse(payloadEvent.body);
            let header = payloadEvent.headers['X-Shopify-Topic'];
            let productId = (payloadObj.id).toString();
            logger.debug(`${context.awsRequestId} Payload id : ${productId} and header : ${header} `);
            if ('products/create' === header || 'products/update' === header) {
                prepareShopifyObject(context).then(Shopify => {
                    let metafieldUrl = '/admin/products/' + productId + '/metafields.json';
                    shopifyGet(Shopify, metafieldUrl, null, context).then(productMetafields => {
                        prepareProduct(record.eventID, productId, payloadObj, productMetafields, context).then(productInfo => {
                            processProductData(productInfo, context).then(success => {
                                logger.debug(`${context.awsRequestId} Successfully processed product data productId : ${productId} `);
                                return callback(null, `Successfully processed ${event.Records.length} records.`);
                            });
                        });
                    });
                }).catch(err => {
                    logger.error(`${context.awsRequestId} error : ${err}`);
                    return callback(err);
                });
            } else if ('products/delete' === header) {
                let params = {
                    TableName: process.env.ProductsTableName,
                    Key: {
                        Id: productId
                    }
                };
                dynamoGet(params, context).then(product => {
                    if (imports.underscore.isEmpty(product)) {
                        logger.debug(`${context.awsRequestId} No data in db for productId : ${productId}`);
                        return callback(null, `Unprocessed  ${event.Records.length} records.`);
                    } else {
                        dynamoDelete(params, context).then(data => {
                            logger.debug(`${context.awsRequestId} Successfully deleted product data productId : ${productId}`);
                            return callback(null, `Successfully deleted ${event.Records.length} records.`);
                        });
                    }
                }).catch(err => {
                    logger.error(`${context.awsRequestId} error: ${err}`);
                    return callback(err);
                });
            } else {
                logger.debug(`${context.awsRequestId} No action performed for header ${header} and productId : ${productId}`);
                return callback(null, `Unprocessed  ${event.Records.length} records.`);
            }
        } catch (exception) {
            logger.error(`${context.awsRequestId} Exception : ${exception} `);
            return callback(exception);
        }
    }); //each record loop
}; //main