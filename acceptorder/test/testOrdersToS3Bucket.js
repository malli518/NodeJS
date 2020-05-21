'use strict';

const chai = require('chai');
const expect = chai.expect;
const context = require('aws-lambda-mock-context');
const ctx = context();
const ordersToS3Bucket = require('../ordersToS3Bucket');
let event = {};

describe('Test ordersToS3Bucket - ', function() {
    it('Process dynamoOrders to S3Bucket with valid condition', function(done) {
        process.env.createdDate = '2017-01-27';
        process.env.OrdersTableName = 'psAuditOrdersTable';
        process.env.S3Bucket = 'perfectsip-dev-psdatas3bucket-1kg3rbp1qr5oc';
        ordersToS3Bucket.ordersToS3Bucket(event, ctx, function(err, data) {
            try {
                console.log('data==' + JSON.stringify(data));
                expect(data.statusCode).to.equal(200);
                done();
            } catch (error) {
                console.log('error==' + JSON.stringify(error));
                done(error);
            }
        });
    });
    it('Process dynamoOrders to S3Bucket with empty dynamoOrders', function(done) {
        process.env.createdDate = '2017-01-28';
        process.env.OrdersTableName = 'psAuditOrdersTable';
        process.env.S3Bucket = 'perfectsip-dev-psdatas3bucket-1kg3rbp1qr5oc';
        ordersToS3Bucket.ordersToS3Bucket(event, ctx, function(err, data) {
            try {
                console.log('data==' + JSON.stringify(data));
                expect(data.statusCode).to.equal(200);
                done();
            } catch (error) {
                console.log('error==' + JSON.stringify(error));
                done(error);
            }
        });
    });
    it('Process dynamoOrders to S3Bucket with invalid table name', function(done) {
        process.env.createdDate = '2017-01-28';
        process.env.OrdersTableName = 'psAuditOrdersTable1';
        process.env.S3Bucket = 'perfectsip-dev-psdatas3bucket-1kg3rbp1qr5oc';
        ordersToS3Bucket.ordersToS3Bucket(event, ctx, function(err, data) {
            try {
                console.log('data==' + JSON.stringify(data));
                expect(data.statusCode).to.equal(500);
                done();
            } catch (error) {
                console.log('error==' + JSON.stringify(error));
                done(error);
            }
        });
    });
    it('Process dynamoOrders to S3Bucket with invalid bucket  name', function(done) {
        process.env.createdDate = '2017-01-30';
        process.env.OrdersTableName = 'psAuditOrdersTable';
        process.env.S3Bucket = 'psdatas3bucket';
        ordersToS3Bucket.ordersToS3Bucket(event, ctx, function(err, data) {
            try {
                console.log('data==' + JSON.stringify(data));
                expect(data.statusCode).to.equal(500);
                done();
            } catch (error) {
                console.log('error==' + JSON.stringify(error));
                done(error);
            }
        });
    });
    afterEach(function() {
        delete process.env.createdDate;
        delete process.env.OrdersTableName;
        delete process.env.S3Bucket;
    });
});
//npm test test/testOrdersToS3Bucket