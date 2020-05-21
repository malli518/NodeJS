'use strict';

const imports = require('./lib/utils/imports');
const dynamoGet = require('./lib/utils/dynamoGet');
const dynamoQuery = require('./lib/utils/dynamoQuery');
const prepareShopifyObject = require('./lib/utils/prepareShopifyObject');
const shopifyPut = require('./lib/utils/shopifyPut');
const simpleNotificationService = require('./lib/utils/simpleNotificationService');
const Bluebird = require('bluebird');
const logger = imports.log4js.getLogger('updateSKUSForSubscriptionProducts');
logger.setLevel(imports.loggerLevel);

logger.debug('Loading updateSKUSForSubscriptionProducts');

module.exports.updateSKUSForSubscriptionProducts = (event, context, callback) => {
    let productsTable = process.env.ProductsTableName;
    let subscriptionProduct = process.env.SubscriptionProduct;
    let variantsId;
    let title;
    let productId;
    let sku;
    let featuredMonth = imports.moment().format(imports.yearMonthFormat);
    try {
        let params = {
            TableName: productsTable,
            Key: {
                Id: subscriptionProduct
            }
        };
        dynamoGet(params, context)
            .then(data => {
                if (imports.underscore.isEmpty(data)) {
                    logger.error(`  ${context.awsRequestId}  updateSKUSForSubscriptionProducts subscriptionProduct is not exist in ${productsTable} : ${subscriptionProduct} : ${data}`);
                    return Bluebird.reject(new Error(`${context.awsRequestId} subscriptionProduct does not exist in DB ${productsTable} : ${subscriptionProduct} `));
                } else {
                    let variantsObj = JSON.parse(data.Item.Variants);
                    title = data.Item.Title;
                    let variantsLength = Object.keys(variantsObj).length;
                    for (let i = 0; i < variantsLength; i++) {
                        productId = variantsObj[i].product_id.toString();
                        if (productId === subscriptionProduct && variantsObj[i].position === 1) {
                            variantsId = variantsObj[i].id;
                        }
                    }
                    let params = {
                        TableName: productsTable,
                        IndexName: process.env.ProductsTableProductTypeIndex,
                        KeyConditionExpression: 'ProductType = :productType',
                        FilterExpression: 'collection_dtl_featured_month = :collection_dtl_featured_month',
                        ExpressionAttributeValues: {
                            ':productType': process.env.PoductType,
                            ':collection_dtl_featured_month': featuredMonth
                        },
                        ProjectionExpression: 'Id,ProductType,Variants,collection_dtl_featured_month'
                    };
                    return dynamoQuery(params, context);
                }
            }).then(skuData => {
                if (imports.underscore.isEmpty(skuData)) {
                    logger.error(`  ${context.awsRequestId}  updateSKUSForSubscriptionProducts This month's featured collection does not exist in ${productsTable} : ${skuData}`);
                    return Bluebird.reject(new Error(`${context.awsRequestId} collection_dtl_featured data is not exist in DB ${productsTable} `));
                } else {
                    logger.debug(`${context.awsRequestId} skuData ${JSON.stringify(skuData)} `);
                    for (let i = 0; i < skuData.Items.length; i++) {
                        let skuProductId = skuData.Items[i].Id;
                        logger.debug(`${context.awsRequestId} skuProductId ${skuProductId} `);
                        let wcVariantsObj = JSON.parse(skuData.Items[i].Variants);
                        let wcVariantsLength = Object.keys(wcVariantsObj).length;
                        for (let j = 0; j < wcVariantsLength; j++) {
                            if (wcVariantsObj[j].position === 1) {
                                sku = wcVariantsObj[j].sku;
                            }
                        }
                    }
                    return prepareShopifyObject(context);
                }
            }).then(Shopify => {
                if (productId && variantsId && sku) {
                    let productUpdateUrl = '/admin/products/' + productId + '.json';
                    let queryParmas = {
                        'product': {
                            'id': productId,
                            'variants': [{
                                'id': variantsId,
                                'product_id': productId,
                                'sku': sku
                            }]
                        }
                    };
                    return shopifyPut(Shopify, productUpdateUrl, queryParmas, context);
                } else {
                    logger.error(`  ${context.awsRequestId}  updateSKUSForSubscriptionProducts one of the required field is empty..  ProductId : ${productId} : VariantsId : ${variantsId} : SKU : ${sku} `);
                    return Bluebird.reject(new Error('${context.awsRequestId} updateSKUSForSubscriptionProducts one of the required field is empty'));
                }
            }).then(res => {
                logger.debug(`${context.awsRequestId} shopifyPut response ${JSON.stringify(res)} `);
                let mailBody = 'SKU for Collection Product ' + productId + ' successfully updated to ' + featuredMonth + ' for current monthly collection ' + title;
                logger.debug(`${context.awsRequestId} mailBody:  ${mailBody} `);
                let params = {
                    TargetArn: process.env.SKUSNSSubscription,
                    Message: mailBody,
                    Subject: 'SKSSubscription'
                };
                return simpleNotificationService(params, context);
            }).then(success => {
                logger.debug(`${context.awsRequestId} simpleNotificationService response ${JSON.stringify(success)} `);
                callback(null, { message: 'Process done' });
            })
            .catch(err => {
                logger.error(`${context.awsRequestId}  updateSKUSForSubscriptionProducts err: ${err}`);
                callback(err);
            });
    } catch (exception) {
        logger.error(`${context.awsRequestId}  updateSKUSForSubscriptionProducts exception: ${exception}`);
        callback(exception);
    }
};