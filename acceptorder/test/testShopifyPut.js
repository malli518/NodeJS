'use strict';

const chai = require('chai');
const expect = chai.expect;
const shopifyPut = require('../lib/utils/shopifyPut');
const imports = require('../lib/utils/imports');
let context = {};
context.awsRequestId = 'tempAwsRequestId';

describe('Test shopifyPut -', function() {
    // it('update the sku of a product  with success state', function() {
    //     let queryParmas = {
    //         'product': {
    //             'id': '6692455557',
    //             'variants': [{
    //                 'id': 22475764613,
    //                 'product_id': '6692455557',
    //                 'sku': 100019
    //             }]
    //         }
    //     };
    //     let Shopify = new imports.shopifyAPI({
    //         shop: 'winestoredev',
    //         access_token: 'f6f2c5249bb08c812a6d90c4c3d69b5a',
    //         rate_limit_delay: '20000',
    //         backoff: '70',
    //         backoff_delay: '5000',
    //         verbose: false
    //     });
    //     let metafieldUrl = '/admin/products/6692455557.json';
    //     return shopifyPut(Shopify, metafieldUrl, queryParmas, context)
    //         .then(function(data) {
    //             console.log(JSON.stringify(data));
    //             expect(data).to.exist;
    //         });
    // });
    it('update the sku of a product  with invalid access_token', function() {
        let queryParmas = {
            'product': {
                'id': '6692455557',
                'variants': [{
                    'id': 22475764613,
                    'product_id': '6692455557',
                    'sku': 100019
                }]
            }
        };
        let Shopify = new imports.shopifyAPI({
            shop: 'winestoredev',
            access_token: 'access_token',
            rate_limit_delay: '20000',
            backoff: '70',
            backoff_delay: '5000',
            verbose: false
        });
        let metafieldUrl = '/admin/products/6692455557.json';
        return shopifyPut(Shopify, metafieldUrl, queryParmas, context)
            .then(function(data) {
                expect(data).to.not.exist;
            }).catch(function(err) {
                console.log(err.error);
                expect(err.code).to.equal(401);
            });
    });
    it('update the sku of a product  with invalid shop domain name', function() {
        let queryParmas = {
            'product': {
                'id': '6692455557',
                'variants': [{
                    'id': 22475764613,
                    'product_id': '6692455557',
                    'sku': 100019
                }]
            }
        };
        let Shopify = new imports.shopifyAPI({
            shop: 'invalidShop',
            access_token: 'f6f2c5249bb08c812a6d90c4c3d69b5a',
            rate_limit_delay: '20000',
            backoff: '70',
            backoff_delay: '5000',
            verbose: false
        });
        let metafieldUrl = '/admin/products/6692455557.json';
        return shopifyPut(Shopify, metafieldUrl, queryParmas, context)
            .then(function(data) {
                expect(data).to.not.exist;
            }).catch(function(err) {
                console.log(err.error);
                expect(err.code).to.equal(404);
            });
    });
    it('update the sku of a product  with invalid Product variants id', function() {
        let queryParmas = {
            'product': {
                'id': '6692455557',
                'variants': [{
                    'id': 123456789,
                    'product_id': '6692455557',
                    'sku': 100019
                }]
            }
        };
        let Shopify = new imports.shopifyAPI({
            shop: 'winestoredev',
            access_token: 'f6f2c5249bb08c812a6d90c4c3d69b5a',
            rate_limit_delay: '20000',
            backoff: '70',
            backoff_delay: '5000',
            verbose: false
        });
        let metafieldUrl = '/admin/products/6692455557.json';
        return shopifyPut(Shopify, metafieldUrl, queryParmas, context)
            .then(function(data) {
                expect(data).to.not.exist;
            }).catch(function(err) {
                console.log(err.error);
                expect(err.code).to.equal(422);
            });
    });
    it('update the sku of a product  with invalid Product  id', function() {
        let queryParmas = {
            'product': {
                'id': '123456789',
                'variants': [{
                    'id': 22475764613,
                    'product_id': '123456789',
                    'sku': 100019
                }]
            }
        };
        let Shopify = new imports.shopifyAPI({
            shop: 'winestoredev',
            access_token: 'f6f2c5249bb08c812a6d90c4c3d69b5a',
            rate_limit_delay: '20000',
            backoff: '70',
            backoff_delay: '5000',
            verbose: false
        });
        let metafieldUrl = '/admin/products/123456789.json';
        return shopifyPut(Shopify, metafieldUrl, queryParmas, context)
            .then(function(data) {
                expect(data).to.not.exist;
            }).catch(function(err) {
                console.log(err.error);
                expect(err.code).to.equal(404);
            });
    });
});
//npm test test/testShopifyPut