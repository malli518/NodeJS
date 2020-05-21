'use strict';

const chai = require('chai');
const expect = chai.expect;
const prepareDynamoOrders = require('../lib/utils/prepareDynamoOrders');
let context = {};
context.awsRequestId = 'tempAwsRequestId';

describe('Test prepareDynamoOrders -', function() {
    it('Preapre DynamoOrders with success state', function() {
        let dynamoOrders = [{ 'Items': [{ 'ProcessingTime': 3151, 'ShopifyUpdatedDate': '2017-01-27', 'ShopifyUpdated': '2017-01-27T04:59:40.000Z', 'InternalProcessingTime': 1850, 'ShopifyCreatedDate': '2017-01-27', 'ShopifyCancelledFlag': 0, 'Id': 'shardId-000000000000:49569579067845859367373317328012100629704687768462950402', 'PSSent': 1, 'OrderId': 4229676549, 'ShopifyCreated': '2017-01-27T04:59:40.000Z', 'Created': '2017-01-27T04:59:43.150Z' }, { 'ProcessingTime': 3121, 'ShopifyUpdatedDate': '2017-01-27', 'ShopifyUpdated': '2017-01-27T04:55:50.000Z', 'InternalProcessingTime': 1555, 'ShopifyCreatedDate': '2017-01-27', 'ShopifyCancelledFlag': 0, 'Id': 'shardId-000000000000:49569579067845859367373317312159456357098039595061215234', 'PSSent': 0, 'OrderId': 4229667525, 'ShopifyCreated': '2017-01-27T04:52:22.000Z', 'Created': '2017-01-27T04:55:53.120Z' }, { 'ProcessingTime': 3023, 'ShopifyUpdatedDat': '2017-01-27', 'ShopifyUpdated': '2017-01-27T04:52:22.000Z', 'InternalProcessingTime': 2010, 'ShopifyCreatedDate': '2017-01-27', 'ShopifyCancelledFlag': 0, 'Id': 'shardId-000000000000:49569579067845859367373317298044038487277615057540743170', 'PSSent': 0, 'OrderId': 4229667526, 'ShopifyCreated': '2017-01-27T04:52:22.000Z', 'Created': '2017-01-27T04:52:25.022Z' }, { 'ProcessingTime': 3023, 'ShopifyUpdatedDat': '2017-01-26', 'ShopifyUpdated': '2017-01-26T04:52:22.000Z', 'InternalProcessingTime': 2010, 'ShopifyCreatedDate': '2017-01-26', 'ShopifyCancelledFlag': 0, 'Id': 'shardId-000000000000:49569579067845859367373317298044038487277615057540743170', 'PSSent': 0, 'OrderId': 4229667529, 'ShopifyCreated': '2017-01-26T04:52:22.000Z', 'Created': '2017-01-26T04:52:25.022Z' }], 'Count': 3, 'ScannedCount': 1363 }];
        return prepareDynamoOrders(dynamoOrders, context)
            .then(function(data) {
                console.log(data);
                expect(data).to.exist;
            });
    });
    it('Preapre DynamoOrders with out Items object', function() {
        let dynamoOrders = [{}];
        return prepareDynamoOrders(dynamoOrders, context)
            .then(function(data) {
                expect(data).to.not.exist;
            }).catch(function(err) {
                console.log(err.message);
                expect(err.message).to.contain('Cannot read property');
            });
    });
    it('Preapre DynamoOrders with empty  Items array', function() {
        let dynamoOrders = [{ 'Items': [] }];
        return prepareDynamoOrders(dynamoOrders, context)
            .then(function(data) {
                console.log('data=' + data);
                expect(data.length).to.equal(0);
            });
    });
});
//npm test test/testPrepareDynamoOrders