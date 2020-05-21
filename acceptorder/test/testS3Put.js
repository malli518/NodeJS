'use strict';

const chai = require('chai');
const expect = chai.expect;
const s3Put = require('../lib/utils/s3Put');
const imports = require('../lib/utils/imports');
let context = {};
context.awsRequestId = 'tempAwsRequestId';

describe('Test s3Put -', function() {
    it('Put listOfDynamoOrders into S3Bucket with valid state', function() {
        let listOfDynamoOrders = [{ "ProcessingTime": 3151, "ShopifyUpdatedDate": "2017-01-27", "ShopifyUpdated": "2017-01-27T04:59:40.000Z", "InternalProcessingTime": 1850, "ShopifyCreatedDate": "2017-01-27", "ShopifyCancelledFlag": 0, "Id": "shardId-000000000000:49569579067845859367373317328012100629704687768462950402", "PSSent": 1, "OrderId": 4229676549, "ShopifyCreated": "2017-01-27T04:59:40.000Z", "Created": "2017-01-27T04:59:43.150Z" }, { "ProcessingTime": 3121, "ShopifyUpdatedDate": "2017-01-27", "ShopifyUpdated": "2017-01-27T04:55:50.000Z", "InternalProcessingTime": 1555, "ShopifyCreatedDate": "2017-01-27", "ShopifyCancelledFlag": 0, "Id": "shardId-000000000000:49569579067845859367373317312159456357098039595061215234", "PSSent": 0, "OrderId": 4229667525, "ShopifyCreated": "2017-01-27T04:52:22.000Z", "Created": "2017-01-27T04:55:53.120Z" }]
        let csvDynaoOrders = imports.json2csv({ data: listOfDynamoOrders });
        let createdDate = '2017-01-27';
        process.env.S3Bucket = 'perfectsip-dev-psdatas3bucket-1kg3rbp1qr5oc';
        return s3Put(csvDynaoOrders, createdDate, 'csv', context)
            .then(function(data) {
                console.log(JSON.stringify(data));
                expect(data).to.exist;
            });
    });
    it('Put listOfDynamoOrders into S3Bucket with invalid bucket name', function() {
        let listOfDynamoOrders = [{ "ProcessingTime": 3151, "ShopifyUpdatedDate": "2017-01-27", "ShopifyUpdated": "2017-01-27T04:59:40.000Z", "InternalProcessingTime": 1850, "ShopifyCreatedDate": "2017-01-27", "ShopifyCancelledFlag": 0, "Id": "shardId-000000000000:49569579067845859367373317328012100629704687768462950402", "PSSent": 1, "OrderId": 4229676549, "ShopifyCreated": "2017-01-27T04:59:40.000Z", "Created": "2017-01-27T04:59:43.150Z" }, { "ProcessingTime": 3121, "ShopifyUpdatedDate": "2017-01-27", "ShopifyUpdated": "2017-01-27T04:55:50.000Z", "InternalProcessingTime": 1555, "ShopifyCreatedDate": "2017-01-27", "ShopifyCancelledFlag": 0, "Id": "shardId-000000000000:49569579067845859367373317312159456357098039595061215234", "PSSent": 0, "OrderId": 4229667525, "ShopifyCreated": "2017-01-27T04:52:22.000Z", "Created": "2017-01-27T04:55:53.120Z" }]
        let csvDynaoOrders = imports.json2csv({ data: listOfDynamoOrders });
        let createdDate = '2017-01-27';
        process.env.S3Bucket = 'psDataS3Bucket';
        return s3Put(csvDynaoOrders, createdDate, 'csv', context)
            .then(function(data) {
                expect(data).to.not.exist;
            }).catch(function(err) {
                console.log(err.code);
                expect(err.code).to.equal('NoSuchBucket');
            });
    });
    it('Put listOfDynamoOrders into S3Bucket and with out converstion of dynamoOrders to csv', function() {
        let listOfDynamoOrders = [{ "ProcessingTime": 3151, "ShopifyUpdatedDate": "2017-01-27", "ShopifyUpdated": "2017-01-27T04:59:40.000Z", "InternalProcessingTime": 1850, "ShopifyCreatedDate": "2017-01-27", "ShopifyCancelledFlag": 0, "Id": "shardId-000000000000:49569579067845859367373317328012100629704687768462950402", "PSSent": 1, "OrderId": 4229676549, "ShopifyCreated": "2017-01-27T04:59:40.000Z", "Created": "2017-01-27T04:59:43.150Z" }, { "ProcessingTime": 3121, "ShopifyUpdatedDate": "2017-01-27", "ShopifyUpdated": "2017-01-27T04:55:50.000Z", "InternalProcessingTime": 1555, "ShopifyCreatedDate": "2017-01-27", "ShopifyCancelledFlag": 0, "Id": "shardId-000000000000:49569579067845859367373317312159456357098039595061215234", "PSSent": 0, "OrderId": 4229667525, "ShopifyCreated": "2017-01-27T04:52:22.000Z", "Created": "2017-01-27T04:55:53.120Z" }]
            //let csvDynaoOrders = imports.json2csv({ data: listOfDynamoOrders });
        let createdDate = '2017-01-27';
        process.env.S3Bucket = 'perfectsip-dev-psdatas3bucket-1kg3rbp1qr5oc';
        return s3Put(listOfDynamoOrders, createdDate, 'csv', context)
            .then(function(data) {
                expect(data).to.not.exist;
            }).catch(function(err) {
                console.log(err.code);
                expect(err.code).to.equal('InvalidParameterType');
            });
    });
    afterEach(function() {
        delete process.env.S3Bucket;
        //delete process.env.OrdersTableName;
    });
});
//npm test test/testS3Put