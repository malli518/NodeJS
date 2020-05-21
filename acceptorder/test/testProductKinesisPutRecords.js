'use strict';

const chai = require('chai');
const expect = chai.expect;
const productKinesisPutRecord = require('../lib/utils/productKinesisPutRecord');
let context = {};
context.awsRequestId = 'tempAwsRequestId';
let validEvent = {};
validEvent.body = '{"id":"1234"}';

let invalidEvent = {};
invalidEvent.body = '{"code":"test"}';
describe('Test productKinesisPutRecord -', function() {
    // it('put product data into kinesis with valid stream name', function() {
    //     process.env.KinesisStream = 'psProductsStream';
    //     return productKinesisPutRecord(validEvent, context)
    //         .then(function(data) {
    //             expect(data).to.exist;
    //         });
    // });
    it('put product data into kinesis with invalid stream name', function() {
        process.env.KinesisStream = 'psProductsStream1';
        return productKinesisPutRecord(validEvent, context)
            .then(function(data) {
                expect(data).to.not.exist;
            }).catch(function(err) {
                //  console.log(err);
                expect(err.code).to.equal('ResourceNotFoundException');
            });
    });
    it('Put product data into kinesis with valid streamName and body without id', function() {
        process.env.KinesisStream = 'psOrdersStream';
        return productKinesisPutRecord(invalidEvent, context)
            .then(function(data) {
                expect(data.ShardId).to.not.exist;
            })
            .catch(function(err) {
                console.log('data.message' + err.message);
                expect(err.message).to.contain('toString');
            });
    });
});
//npm test test/testProductKinesisPutRecords