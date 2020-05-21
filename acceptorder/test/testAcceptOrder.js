'use strict';

const chai = require('chai');
const expect = chai.expect;
const context = require('aws-lambda-mock-context');
const ctx = context();
const acceptOrder = require('../acceptOrder');
const SHOPIFY_SECRET = 'AQECAHioVPE+YJ4b5SohCuIr6R7VR/be4EWPMaagqncHkd8O3AAAAHQwcgYJKoZIhvcNAQcGoGUwYwIBADBeBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDMhl9dRGpy2IMQyaiAIBEIAxO1iZ9uabbGAEQBwompidRvcVbQow9rOQgbLiIlfIPaLilSZpmErajcklYG4Q1PZfRQ==';
const AcceptOrderErrorSubscription = 'arn:aws:sns:us-west-2:781812356504:perfectSip-dev-AcceptOrderErrorSNS-H3PVL49490TX';

//prepare event object
let Shop_Domain = 'node1.myshopify.com';
let validEvent = {};
let xShopifyHmacHeader = {};
validEvent.body = '{"id":"1234"}';
xShopifyHmacHeader['X-Shopify-Hmac-Sha256'] = 'QPlZlW2L0dF0T9j+UyxPQxhzfp9hm2UJTTJVKV2KNV4=';
xShopifyHmacHeader['X-Shopify-Shop-Domain'] = Shop_Domain;
validEvent['headers'] = xShopifyHmacHeader;

let inValidEvent = {};
inValidEvent.body = '{"id":"12345"}';
inValidEvent['headers'] = xShopifyHmacHeader;

let emptyEvent = {};

describe('Test accept order - ', function() {

    it('Test accept order with default ShopifySecret', function(done) {
        acceptOrder.postOrder(validEvent, ctx, function(err, data) {
            try {
                expect(data.statusCode).to.equal(500);
                done();
            } catch (error) {
                done(error);
            }
        });
    });

    it('Test accept order with valid secret,SNS params with invalid body', function(done) {
        process.env.ShopifySecret = SHOPIFY_SECRET;
        process.env.AcceptOrderErrorSubscription = AcceptOrderErrorSubscription;
        process.env.psShop = Shop_Domain;
        acceptOrder.postOrder(inValidEvent, ctx, function(err, data) {
            try {
                expect(data.statusCode).to.equal(500);
                done();
            } catch (error) {
                done(error);
            }
        });
    });

    it('Test accept order with valid secret,body and invalid stream  ', function(done) {
        process.env.ShopifySecret = SHOPIFY_SECRET;
        process.env.KinesisStream = 'testOrdersStream';
        process.env.psShop = Shop_Domain;
        acceptOrder.postOrder(validEvent, ctx, function(err, data) {
            try {
                expect(data.statusCode).to.equal(500);
                done();
            } catch (error) {
                done(error);
            }
        });
    });

    it('Test accept order with empty event', function(done) {
        acceptOrder.postOrder(emptyEvent, ctx, function(err, data) {
            try {
                expect(data.statusCode).to.equal(500);
                done();
            } catch (error) {
                done(error);
            }
        });
    });

    /*
    it('Test accept order with valid secret,body and valid stream  ', function(done) {
        process.env.ShopifySecret = SHOPIFY_SECRET;
        process.env.KinesisStream = 'psOrdersStream';
        process.env.psShop = Shop_Domain;
        acceptOrder.postOrder(validEvent, ctx, function(err, data) {
            try {
                expect(data.statusCode).to.equal(200);
                expect(data.body).to.contain('ShardId');
                done();
            } catch (error) {
                done(error);
            }
        });
    });
    */

    afterEach(function() {
        delete process.env.ShopifySecret;
        delete process.env.KinesisStream;
        delete process.env.psShop;
        delete process.env.AcceptOrderErrorSubscription;
    });
});