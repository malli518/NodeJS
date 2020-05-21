'use strict';

const chai = require('chai');
const expect = chai.expect;
const verifyShopifyWebhook = require('../lib/utils/verifyShopifyWebhook').verifyShopifyWebhook;
const SHOPIFY_SECRET = "AQECAHioVPE+YJ4b5SohCuIr6R7VR/be4EWPMaagqncHkd8O3AAAAHQwcgYJKoZIhvcNAQcGoGUwYwIBADBeBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDMhl9dRGpy2IMQyaiAIBEIAxO1iZ9uabbGAEQBwompidRvcVbQow9rOQgbLiIlfIPaLilSZpmErajcklYG4Q1PZfRQ==";

//prepare event object
let Shop_Domain = "node1.myshopify.com";
let validEvent = {};
let xShopifyHmacHeader = {};
validEvent.body = '{"id":"1234"}';
xShopifyHmacHeader["X-Shopify-Hmac-Sha256"] = "pRGLfUBVdRH+huQuqRuYqPqrcNv+sJN/GUsLOAYBBhM=";
xShopifyHmacHeader["X-Shopify-Shop-Domain"] = Shop_Domain;
validEvent["headers"] = xShopifyHmacHeader;

let inValidEvent = {};
inValidEvent.body = '{"id":"12345"}';
inValidEvent["headers"] = xShopifyHmacHeader;

let context = {};
context.awsRequestId = 'tempAwsRequestId';

describe('Verify Shopify Webhook', function() {
    it('Given details should match with hmac', function() {
        process.env.psShop = Shop_Domain;
        return verifyShopifyWebhook(SHOPIFY_SECRET, validEvent, context).then(function(data) {
            expect(data).to.equal(true);
        }); // no catch, it'll figure it out since the promise is rejected
    });

    it('Given details should not match with hmac', function() {
        process.env.psShop = Shop_Domain;
        return verifyShopifyWebhook(SHOPIFY_SECRET, inValidEvent, context)
            .then(function(data) {
                expect(data).to.equal('fail');
            })
            .catch(function(err) {
                expect(err.message).to.equal("HMAC verification failed.");
            });
    });
    afterEach(function() {
        delete process.env.psShop;
    });
});