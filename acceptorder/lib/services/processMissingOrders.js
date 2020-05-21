'use strict';

const imports = require('../utils/imports');
const shopifyGet = require('../utils/shopifyGet');
const kinesisPutRecord = require('../utils/kinesisPutRecord');
const dynamoPut = require('../utils/dynamoPut');

const logger = imports.log4js.getLogger('processMissingOrders');
logger.setLevel(imports.loggerLevel);
const Bluebird = require('bluebird');

const processMissingOrders = function(Shopify, missingOrders, shopifyScheduleDates, event, context) {
    return new Bluebird((resolve, reject) => {
        try {
            let missingOrdersCount = missingOrders.length;
            let sliceStartPos = 0;
            let sliceEndPos = 50;
            let limit = 50;
            let noOfTimes = Math.ceil(missingOrdersCount / limit);
            let deferredMissingOrdersInfo = [];
            let shopifyUrl = '/admin/orders.json';
            for (let i = 0; i < noOfTimes; i++) {
                let options = {};
                //options['limit'] = limit;
                let missedOrders = missingOrders.slice(sliceStartPos, sliceEndPos);
                options['ids'] = missedOrders.join();
                options['status'] = event.status;
                sliceStartPos = sliceEndPos;
                sliceEndPos = sliceEndPos + limit;
                deferredMissingOrdersInfo.push(
                    //call to get order info
                    shopifyGet(Shopify, shopifyUrl, options, context)
                );
            }
            Bluebird.all(deferredMissingOrdersInfo)
                .then(ordersInfo => {
                    let deferredKinesisPutRecords = [];
                    //needs to write multilevel for loops
                    logger.debug(`ordersInfo.length : ${ordersInfo.length} `);
                    for (let i = 0; i < ordersInfo.length; i++) {
                        for (let j = 0; j < ordersInfo[i].orders.length; j++) {
                            deferredKinesisPutRecords.push(
                                //call kinesisPutRecord to put records into kinesis
                                kinesisPutRecord(JSON.stringify(ordersInfo[i].orders[j]), context)
                            );
                        }
                    }
                    Bluebird.all(deferredKinesisPutRecords)
                        .then(kinesisResponse => {
                            let params = {
                                TableName: process.env.AuditSchedulerTableName,
                                Item: {
                                    'Id': event.scheduleOrderName,
                                    'LastRunDate': shopifyScheduleDates['lastRunDate'],
                                    'ScheduleFromDate': shopifyScheduleDates['scheduleFromDate'],
                                    'ScheduleToDate': shopifyScheduleDates['scheduleToDate']
                                }
                            };
                            return dynamoPut(params, context);
                        }).then(response => {
                            logger.debug(`Updated Successfully : ${response} `);
                            resolve(response);
                        });
                })
                .catch(function(err) {
                    logger.error(`  ${context.awsRequestId}  processMissingOrders error: ${err}`);
                    reject(err);
                });
        } catch (exception) {
            logger.error(`  ${context.awsRequestId}  processMissingOrders exception: ${exception}`);
            reject(exception);
        }
    });
};
module.exports = processMissingOrders;