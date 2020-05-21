'use strict';

const imports = require('../utils/imports');
const psAuditScheduleDates = require('../utils/psAuditScheduleDates');
const shopifyGet = require('../utils/shopifyGet');
const getShopifyCancelledOrderIds = require('../utils/getShopifyCancelledOrderIds');
const dynamoQuery = require('../utils/dynamoQuery');
const prepareDynamoOrders = require('../utils/prepareDynamoOrders');
const missingOrders = require('../utils/missingOrders');
const prepareShopifyObject = require('../utils/prepareShopifyObject');

const logger = imports.log4js.getLogger('shopifyCancelledMissingOrders');
logger.setLevel(imports.loggerLevel);

const Bluebird = require('bluebird');

const shopifyCancelledMissingOrders = function(event, context) {
    let shopifyMissingOrdersPromise = {};
    let shopifyOrderIds;
    let shopifyObject;
    let shopifyScheduleDates;
    return new Bluebird((resolve, reject) => {
        try {
            let encryptedKeys = {};
            encryptedKeys['ShopifyApiKey'] = process.env.ShopifyApiKey;
            encryptedKeys['ShopifyAccessToken'] = process.env.ShopifyAccessToken;
            //call psAuditScheduleDates for from and to dates
            let params = {
                TableName: process.env.AuditSchedulerTableName,
                KeyConditionExpression: 'Id = :id',
                ExpressionAttributeValues: {
                    ':id': event.scheduleOrderName
                },
                Limit: 1,
                ScanIndexForward: false //descending order..
            };
            psAuditScheduleDates(params, context)
                .then(scheduleDates => {
                    shopifyMissingOrdersPromise['scheduleDates'] = scheduleDates;
                    shopifyScheduleDates = scheduleDates;
                    logger.debug(` ${context.awsRequestId} shopifyScheduleDates : ${JSON.stringify(shopifyScheduleDates)} `);
                    //call prepareShopifyObject
                    return prepareShopifyObject(context);
                }).then(Shopify => {
                    shopifyMissingOrdersPromise['Shopify'] = Shopify;
                    shopifyObject = Shopify;
                    //get shopify orders count
                    let shopifyUrl = '/admin/orders/count.json';
                    let query_data = {
                        'updated_at_min': shopifyScheduleDates['scheduleFromDate'],
                        'status': event.status
                    };
                    return shopifyGet(shopifyObject, shopifyUrl, query_data, context);
                }).then(ordersCount => {
                    logger.debug(`${context.awsRequestId} Count from shopify :  ${ordersCount.count} `);
                    let limit = 50;
                    let noOfTimes = Math.ceil(ordersCount.count / limit);
                    let deferredOrderIds = [];
                    let shopifyUrl = '/admin/orders.json';
                    for (let i = 1; i <= noOfTimes; i++) {
                        let options = {};
                        options['fields'] = 'id,cancelled_at';
                        options['limit'] = limit;
                        options['page'] = i;
                        options['updated_at_min'] = shopifyScheduleDates['scheduleFromDate'];
                        options['status'] = event.status;
                        deferredOrderIds.push(
                            //call shopifyOrders to get orderid's
                            shopifyGet(shopifyObject, shopifyUrl, options, context)
                        );
                    }
                    return Bluebird.all(deferredOrderIds);
                })
                .then(orderIds => {
                    return getShopifyCancelledOrderIds(orderIds, shopifyScheduleDates, context);
                })
                .then(orderIdsData => {
                    shopifyOrderIds = orderIdsData;
                    let deferredDynamoOrderIds = [];
                    let itr = imports.moment.twix(new Date(shopifyScheduleDates['scheduleFromDate']), new Date(shopifyScheduleDates['scheduleToDate'])).iterate('days');
                    while (itr.hasNext()) {
                        let cancelledDate = imports.moment(itr.next().toDate()).format(imports.dateFormat);
                        let params = {
                            TableName: process.env.OrdersTableName,
                            IndexName: process.env.OrdersTableShopifyCancelledDateIndex,
                            KeyConditionExpression: 'ShopifyCancelledDate = :shopifyCancelledDate',
                            FilterExpression: 'ShopifyCancelledFlag = :shopifyCancelledFlag',
                            ExpressionAttributeValues: {
                                ':shopifyCancelledDate': cancelledDate,
                                ':shopifyCancelledFlag': event.shopifyCancelledFlag
                            },
                            ProjectionExpression: 'Id,ShopifyCancelledDate,ShopifyCancelledFlag,OrderId'
                        };
                        deferredDynamoOrderIds.push(
                            //lookup orderid's
                            dynamoQuery(params, context)
                        );
                    }
                    return Bluebird.all(deferredDynamoOrderIds);
                }).then(dynamoOrders => {
                    return prepareDynamoOrders(dynamoOrders, context);
                }).then(dynamoOrderIds => {
                    return missingOrders(shopifyOrderIds, dynamoOrderIds, context);
                })
                .then(missingOrders => {
                    shopifyMissingOrdersPromise['missingOrders'] = missingOrders;
                    resolve(shopifyMissingOrdersPromise);
                })
                .catch(function(err) {
                    logger.error(`  ${context.awsRequestId}  shopifyCancelledMissingOrders error: ${err}`);
                    reject(err);
                });
        } catch (exception) {
            logger.error(`  ${context.awsRequestId}  shopifyCancelledMissingOrders exception: ${exception}`);
            reject(exception);
        }
    });
};
module.exports = shopifyCancelledMissingOrders;