'use strict';

const chai = require('chai');
const expect = chai.expect;
const shopifyGet = require('../lib/utils/shopifyGet');
const imports = require('../lib/utils/imports');
let context = {};
context.awsRequestId = 'tempAwsRequestId';

describe('Test shopifyGet -', function() {
    it('get the Product metafileds  with success state', function() {
        let Shopify = new imports.shopifyAPI({
            shop: 'winestoredev',
            access_token: 'f6f2c5249bb08c812a6d90c4c3d69b5a',
            rate_limit_delay: '20000',
            backoff: '70',
            backoff_delay: '5000',
            verbose: false
        });
        let metafieldUrl = '/admin/products/6692455557/metafields.json';
        return shopifyGet(Shopify, metafieldUrl, null, context)
            .then(function(data) {
                //  console.log(JSON.stringify(data));
                expect(data).to.exist;
            });
    });
    it('get the Product metafileds  with invalid shopify_api_key and access_token', function() {
        let Shopify = new imports.shopifyAPI({
            shop: 'winestoredev.myshopify.com',
            shopify_api_key: 'invalid_shopify_api_keyss',
            access_token: 'invalid_access_token',
            rate_limit_delay: '20000',
            backoff: '70',
            backoff_delay: '5000',
            verbose: false
        });
        let metafieldUrl = '/admin/products/6692455557/metafields.json';
        return shopifyGet(Shopify, metafieldUrl, null, context)
            .then(function(data) {
                expect(data).to.not.exist;
            }).catch(function(err) {
                console.log(err.error);
                expect(err.code).to.equal(401);
            });
    });
    it('get the Product metafileds  with invalid shop domain', function() {
        let Shopify = new imports.shopifyAPI({
            shop: 'myshopify.com',
            shopify_api_key: 'e39b85c9f83eb07dc7a6f600f0069648',
            access_token: 'f6f2c5249bb08c812a6d90c4c3d69b5a',
            rate_limit_delay: '20000',
            backoff: '70',
            backoff_delay: '5000',
            verbose: false
        });
        let metafieldUrl = '/admin/products/6692455557/metafields.json';
        return shopifyGet(Shopify, metafieldUrl, null, context)
            .then(function(data) {
                expect(data).to.not.exist;
            }).catch(function(err) {
                console.log(err.error);
                expect(err.code).to.equal(404);
            });
    });
    it('get the Product metafileds  with invalid Product Id', function() {
        let Shopify = new imports.shopifyAPI({
            shop: 'winestoredev',
            shopify_api_key: 'e39b85c9f83eb07dc7a6f600f0069648',
            access_token: 'f6f2c5249bb08c812a6d90c4c3d69b5a',
            rate_limit_delay: '20000',
            backoff: '70',
            backoff_delay: '5000',
            verbose: false
        });
        let metafieldUrl = '/admin/products/123456789/metafields.json';
        return shopifyGet(Shopify, metafieldUrl, null, context)
            .then(function(data) {
                expect(data).to.not.exist;
            }).catch(function(err) {
                console.log(err.error);
                expect(err.code).to.equal(404);
            });
    });
});
//npm test test/testShopifyGet