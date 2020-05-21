'use strict';

const imports = require('./lib/utils/imports');
const dynamoQuery = require('./lib/utils/dynamoQuery');
const dynamoPut = require('./lib/utils/dynamoPut');

const logger = imports.log4js.getLogger('getOrderInfoFromStream');
logger.setLevel(imports.loggerLevel);
logger.debug('Loading getOrderInfoFromStream function');

module.exports.getOrderInfoFromStream = (event, context, callback) => {
    logger.debug(`event: ${JSON.stringify(event)}`);
    let auditTableName = process.env.OrdersTableName;
    let auditTableOrderIdIndex = process.env.OrdersTableOrderIdIndex;
    event.Records.forEach((record) => {
        // Kinesis data is base64 encoded so decode here
        try {
            const payload = new Buffer(record.kinesis.data, 'base64').toString('utf8');
            logger.debug(`${context.awsRequestId} Payload from kinesis stream ${payload} `);
            let payloadObj = JSON.parse(payload);
            logger.debug(`${context.awsRequestId} Payload id kinesis stream ${payloadObj.id} `);
            logger.debug(`${context.awsRequestId} - OrderId : ${payloadObj.id} - Check if event is create order or cancelled order`);
            if (payloadObj.cancelled_at === null && payloadObj.cancel_reason === null) {
                logger.debug(`${context.awsRequestId} Non Cancelled Order  ${payloadObj.id} `);
                logger.debug(`${context.awsRequestId} - OrderId : ${payloadObj.id} - Check to see if order has already been sent`);
                let param = {
                    TableName: auditTableName,
                    IndexName: auditTableOrderIdIndex,
                    KeyConditionExpression: 'OrderId = :orderId',
                    FilterExpression: 'ShopifyCancelledFlag = :shopifyCancelledFlag and PSSent = :psSent',
                    ExpressionAttributeValues: {
                        ':orderId': payloadObj.id,
                        ':shopifyCancelledFlag': 0,
                        ':psSent': 1
                    },
                    ProjectionExpression: 'OrderId',
                };
                dynamoQuery(param, context)
                    .then(data => {
                        if (data.Count === 0) {
                            logger.debug(`${context.awsRequestId} - OrderId : ${payloadObj.id} - Call Integration Service`);
                            let param = {
                                TableName: auditTableName,
                                Item: {
                                    'Id': record.eventID,
                                    'OrderId': payloadObj.id,
                                    'Created': imports.moment().toISOString(),
                                    'ShopifyCreated': imports.moment(payloadObj.created_at).toISOString(),
                                    'ShopifyUpdated': imports.moment(payloadObj.updated_at).toISOString(),
                                    //"ShopifyCancelled": (payloadObj.cancelled_at === null?"0":imports.moment(payloadObj.cancelled_at).toISOString()),
                                    'ShopifyCreatedDate': imports.moment(payloadObj.created_at).format('YYYY-MM-DD'),
                                    'ShopifyUpdatedDate': imports.moment(payloadObj.updated_at).format('YYYY-MM-DD'),
                                    //"ShopifyCancelledDate": (payloadObj.cancelled_at === null?"0":imports.moment(payloadObj.cancelled_at).format('YYYY-MM-DD')),
                                    'ShopifyCancelledFlag': (payloadObj.cancelled_at === null ? 0 : 1),
                                    'PSSent': 1,
                                    'InternalProcessingTime': (Date.now() - (record.kinesis.approximateArrivalTimestamp * 1000)),
                                    'ProcessingTime': (Date.now() - imports.moment(payloadObj.updated_at).valueOf())
                                }
                            };
                            dynamoPut(param, context).then(data => {
                                logger.debug(`${context.awsRequestId} - OrderId : ${payloadObj.id} - Succeeded inserted fresh order original event: ${JSON.stringify(data)} `);
                                return callback(null, `Successfully processed ${event.Records.length} records.`);
                            });
                        } else {
                            logger.debug(`${context.awsRequestId} Order ${payloadObj.id} has already been sent`);
                            logger.debug(`${context.awsRequestId} - OrderId : ${payloadObj.id} - Do not Call Integration Service`);
                            let param = {
                                TableName: auditTableName,
                                Item: {
                                    'Id': record.eventID,
                                    'OrderId': payloadObj.id,
                                    'Created': imports.moment().toISOString(),
                                    'ShopifyCreated': imports.moment(payloadObj.created_at).toISOString(),
                                    'ShopifyUpdated': imports.moment(payloadObj.updated_at).toISOString(),
                                    //"ShopifyCancelled": (payloadObj.cancelled_at === null?"0":imports.moment(payloadObj.cancelled_at).toISOString()),
                                    'ShopifyCreatedDate': imports.moment(payloadObj.created_at).format('YYYY-MM-DD'),
                                    'ShopifyUpdatedDate': imports.moment(payloadObj.updated_at).format('YYYY-MM-DD'),
                                    //"ShopifyCancelledDate": (payloadObj.cancelled_at === null?"0":imports.moment(payloadObj.cancelled_at).format('YYYY-MM-DD')),
                                    'ShopifyCancelledFlag': (payloadObj.cancelled_at === null ? 0 : 1),
                                    'PSSent': 0,
                                    'InternalProcessingTime': (Date.now() - (record.kinesis.approximateArrivalTimestamp * 1000)),
                                    'ProcessingTime': (Date.now() - imports.moment(payloadObj.updated_at).valueOf())
                                }
                            };
                            dynamoPut(param, context).then(data => {
                                logger.debug(`${context.awsRequestId} - OrderId : ${payloadObj.id} - Succeeded inserted fresh order duplicate event: ${JSON.stringify(data)} `);
                                return callback(null, `Successfully processed ${event.Records.length} records.`);
                            });
                        } //fresh order
                    }).catch(err => {
                        logger.error(`${context.awsRequestId} - OrderId : ${payloadObj.id} - error: ${err}`);
                        return callback(err);
                    });
            } //if  cancelled_at & cancelled_reason null
            else {
                logger.debug(`${context.awsRequestId} Cancelled Order  ${payloadObj.id}`);
                logger.debug(`${context.awsRequestId} - OrderId : ${payloadObj.id} - Check if New Order has been sent`);
                let param = {
                    TableName: auditTableName,
                    IndexName: auditTableOrderIdIndex,
                    KeyConditionExpression: 'OrderId = :orderId',
                    FilterExpression: 'ShopifyCancelledFlag = :shopifyCancelledFlag and PSSent = :psSent',
                    ExpressionAttributeValues: {
                        ':orderId': payloadObj.id,
                        ':shopifyCancelledFlag': 0,
                        ':psSent': 1
                    },
                    ProjectionExpression: 'OrderId',
                };
                dynamoQuery(param, context)
                    .then(data => {
                        logger.debug(`${context.awsRequestId} - OrderId : ${payloadObj.id} - Succeeded reading: ${JSON.stringify(data)} `);
                        if (data.Count > 0) {
                            logger.debug(`${context.awsRequestId} - OrderId : ${payloadObj.id} - Check if Cancelled Order has already been sent`);
                            let param = {
                                TableName: auditTableName,
                                IndexName: auditTableOrderIdIndex,
                                KeyConditionExpression: 'OrderId = :orderId',
                                FilterExpression: 'ShopifyCancelledFlag = :shopifyCancelledFlag and PSSent = :psSent',
                                ExpressionAttributeValues: {
                                    ':orderId': payloadObj.id,
                                    ':shopifyCancelledFlag': 1,
                                    ':psSent': 1
                                },
                                ProjectionExpression: 'OrderId',
                            };
                            dynamoQuery(param, context)
                                .then(data => {
                                    if (data.Count === 0) {
                                        //Cancelled Order hasn't been sent
                                        logger.debug(`${context.awsRequestId} - OrderId : ${payloadObj.id} - Call Cancel Order Service`);
                                        logger.debug(`${context.awsRequestId} - OrderId : ${payloadObj.id} - Call Cancel Integration Service`);
                                        let param = {
                                            TableName: auditTableName,
                                            Item: {
                                                'Id': record.eventID,
                                                'OrderId': payloadObj.id,
                                                'Created': imports.moment().toISOString(),
                                                'ShopifyCreated': imports.moment(payloadObj.created_at).toISOString(),
                                                'ShopifyUpdated': imports.moment(payloadObj.updated_at).toISOString(),
                                                'ShopifyCancelled': (payloadObj.cancelled_at === null ? '0' : imports.moment(payloadObj.cancelled_at).toISOString()),
                                                'ShopifyCreatedDate': imports.moment(payloadObj.created_at).format('YYYY-MM-DD'),
                                                'ShopifyUpdatedDate': imports.moment(payloadObj.updated_at).format('YYYY-MM-DD'),
                                                'ShopifyCancelledDate': (payloadObj.cancelled_at === null ? '0' : imports.moment(payloadObj.cancelled_at).format('YYYY-MM-DD')),
                                                'ShopifyCancelledFlag': (payloadObj.cancelled_at === null ? 0 : 1),
                                                'PSSent': 1,
                                                'PSOrderSent': 1,
                                                'InternalProcessingTime': (Date.now() - (record.kinesis.approximateArrivalTimestamp * 1000)),
                                                'ProcessingTime': (Date.now() - imports.moment(payloadObj.updated_at).valueOf())
                                            }
                                        };
                                        dynamoPut(param, context).then(data => {
                                            logger.debug(`${context.awsRequestId} - OrderId : ${payloadObj.id} - Succeeded inserted cancelled order fresh event ${JSON.stringify(data)} `);
                                            return callback(null, `Successfully processed ${event.Records.length} records.`);
                                        });
                                    } else {
                                        logger.debug(`${context.awsRequestId} - OrderId : ${payloadObj.id} - Cancel Order has already been sent`);
                                        logger.debug(`${context.awsRequestId} - OrderId : ${payloadObj.id} - Do not Call Cancel Integration Service`);
                                        let param = {
                                            TableName: auditTableName,
                                            Item: {
                                                'Id': record.eventID,
                                                'OrderId': payloadObj.id,
                                                'Created': imports.moment().toISOString(),
                                                'ShopifyCreated': imports.moment(payloadObj.created_at).toISOString(),
                                                'ShopifyUpdated': imports.moment(payloadObj.updated_at).toISOString(),
                                                'ShopifyCancelled': (payloadObj.cancelled_at === null ? '0' : imports.moment(payloadObj.cancelled_at).toISOString()),
                                                'ShopifyCreatedDate': imports.moment(payloadObj.created_at).format('YYYY-MM-DD'),
                                                'ShopifyUpdatedDate': imports.moment(payloadObj.updated_at).format('YYYY-MM-DD'),
                                                'ShopifyCancelledDate': (payloadObj.cancelled_at === null ? '0' : imports.moment(payloadObj.cancelled_at).format('YYYY-MM-DD')),
                                                'ShopifyCancelledFlag': (payloadObj.cancelled_at === null ? 0 : 1),
                                                'PSSent': 0,
                                                'PSOrderSent': 1,
                                                'InternalProcessingTime': (Date.now() - (record.kinesis.approximateArrivalTimestamp * 1000)),
                                                'ProcessingTime': (Date.now() - imports.moment(payloadObj.updated_at).valueOf())
                                            }
                                        };
                                        dynamoPut(param, context).then(data => {
                                            logger.debug(`${context.awsRequestId} - OrderId : ${payloadObj.id} - Succeeded inserted cancelled order duplicate event' ${JSON.stringify(data)} `);
                                            return callback(null, `Successfully processed ${event.Records.length} records.`);
                                        });
                                    }
                                });
                        } //if for create order existing check 
                        else {
                            logger.debug(`${context.awsRequestId} - OrderId : ${payloadObj.id} - No Need to send cancelled order as New Order has not been sent`);
                            let param = {
                                TableName: auditTableName,
                                Item: {
                                    'Id': record.eventID,
                                    'OrderId': payloadObj.id,
                                    'Created': imports.moment().toISOString(),
                                    'ShopifyCreated': imports.moment(payloadObj.created_at).toISOString(),
                                    'ShopifyUpdated': imports.moment(payloadObj.updated_at).toISOString(),
                                    'ShopifyCancelled': (payloadObj.cancelled_at === null ? '0' : imports.moment(payloadObj.cancelled_at).toISOString()),
                                    'ShopifyCreatedDate': imports.moment(payloadObj.created_at).format('YYYY-MM-DD'),
                                    'ShopifyUpdatedDate': imports.moment(payloadObj.updated_at).format('YYYY-MM-DD'),
                                    'ShopifyCancelledDate': (payloadObj.cancelled_at === null ? '0' : imports.moment(payloadObj.cancelled_at).format('YYYY-MM-DD')),
                                    'ShopifyCancelledFlag': (payloadObj.cancelled_at === null ? 0 : 1),
                                    'PSSent': 0,
                                    'PSOrderSent': 0,
                                    'InternalProcessingTime': (Date.now() - (record.kinesis.approximateArrivalTimestamp * 1000)),
                                    'ProcessingTime': (Date.now() - imports.moment(payloadObj.updated_at).valueOf())
                                }
                            };
                            dynamoPut(param, context).then(data => {
                                logger.debug(`${context.awsRequestId} - OrderId : ${payloadObj.id} - Succeeded inserted cancelled order.. (create order has not been sent) :  ${JSON.stringify(data)} `);
                                return callback(null, `Successfully processed ${event.Records.length} records.`);
                            });
                        }
                    })
                    .catch(err => {
                        logger.error(`${context.awsRequestId} - OrderId : ${payloadObj.id} - error: ${err}`);
                        return callback(err);
                    });
            } //main else
        } catch (exception) {
            logger.error(`${context.awsRequestId} exception: ${exception}`);
            return callback(exception);
        }
    }); //each record loop
}; //main