'use strict';

const chai = require('chai');
const expect = chai.expect;
const kinesisPutRecord = require('../lib/utils/kinesisPutRecord');
let event = {};
event.body = '{"id":"test"}';
let invalidEvent = {};
invalidEvent.body = '{"code":"test"}';
let context = {};
context.awsRequestId = 'tempAwsRequestId';
/*
describe('Test Kinesis put record', function() {
    it('Put record into kinesis with valid StreamName', function() {
        process.env.KinesisStream = 'psOrdersStream';
        return kinesisPutRecord(event.body, context)
            .then(function(data) {
                expect(data.ShardId).to.exist;
            });
    });
    it('Put record into kinesis with invalid StreamName', function() {
        process.env.KinesisStream = 'testOrdersStream';
        return kinesisPutRecord(event.body, context)
            .then(function(data) {
                expect(data.ShardId).to.not.exist;
            })
            .catch(function(err) {
                expect(err.code).to.equal('ResourceNotFoundException');
            });
    });
    it('Put record into kinesis with valid streamName and body without id', function() {
        process.env.KinesisStream = 'psOrdersStream';
        return kinesisPutRecord(invalidEvent.body, context)
            .then(function(data) {
                expect(data.ShardId).to.not.exist;
            })
            .catch(function(err) {
                console.log('data.message' + err.message);
                expect(err.message).to.contain('toString');
            });
    });
    afterEach(function() {
        delete process.env.KinesisStream;
    });
});*/