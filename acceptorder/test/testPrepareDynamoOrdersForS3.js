'use strict';

const chai = require('chai');
const expect = chai.expect;
const prepareDynamoOrdersForS3 = require('../lib/utils/prepareDynamoOrdersForS3');
let context = {};
context.awsRequestId = 'tempAwsRequestId';

describe('Test prepareDynamoOrdersForS3 -', function() {
    it('Get the Items from the dynamoOrders with success condition.', function() {
        let dynamoOrders = [{ 'Items': [{ 'ProcessingTime': 3151, 'ShopifyUpdatedDate': '2017-01-27', 'ShopifyUpdated': '2017-01-27T04:59:40.000Z', 'InternalProcessingTime': 1850, 'ShopifyCreatedDate': '2017-01-27', 'ShopifyCancelledFlag': 0, 'Id': 'shardId-000000000000:49569579067845859367373317328012100629704687768462950402', 'PSSent': 1, 'OrderId': 4229676549, 'ShopifyCreated': '2017-01-27T04:59:40.000Z', 'Created': '2017-01-27T04:59:43.150Z' }, { 'ProcessingTime': 3121, 'ShopifyUpdatedDate': '2017-01-27', 'ShopifyUpdated': '2017-01-27T04:55:50.000Z', 'InternalProcessingTime': 1555, 'ShopifyCreatedDate': '2017-01-27', 'ShopifyCancelledFlag': 0, 'Id': 'shardId-000000000000:49569579067845859367373317312159456357098039595061215234', 'PSSent': 0, 'OrderId': 4229667525, 'ShopifyCreated': '2017-01-27T04:52:22.000Z', 'Created': '2017-01-27T04:55:53.120Z' }, { 'ProcessingTime': 3023, 'ShopifyUpdatedDat': '2017-01-27', 'ShopifyUpdated': '2017-01-27T04:52:22.000Z', 'InternalProcessingTime': 2010, 'ShopifyCreatedDate': '2017-01-27', 'ShopifyCancelledFlag': 0, 'Id': 'shardId-000000000000:49569579067845859367373317298044038487277615057540743170', 'PSSent': 0, 'OrderId': 4229667525, 'ShopifyCreated': '2017-01-27T04:52:22.000Z', 'Created': '2017-01-27T04:52:25.022Z' }], 'Count': 3, 'ScannedCount': 1363 }];
        return prepareDynamoOrdersForS3(dynamoOrders, context)
            .then(function(data) {
                console.log(JSON.stringify(data));
                expect(data).to.exist;
            });
    });
    it('Get the Items from the dynamoOrders with out Items object', function() {
        let dynamoOrders = [{}];
        return prepareDynamoOrdersForS3(dynamoOrders, context)
            .then(function(data) {
                console.log(JSON.stringify(data));
                expect(data).to.not.exist;
            }).catch(function(err) {
                console.log(err.message);
                expect(err.message).to.contain('Cannot read property');
            });
    });
    it('Get the Items from the dynamoOrders with  empty Items array', function() {
        let dynamoOrders = [{ 'Items': [] }];
        return prepareDynamoOrdersForS3(dynamoOrders, context)
            .then(function(data) {
                expect(data.length).to.equal(0);
            });
    });
});
//npm test test/testPrepareDynamoOrdersForS3