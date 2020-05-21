'use strict';

const chai = require('chai');
const expect = chai.expect;
const prepareShopifyOrders = require('../lib/utils/prepareShopifyOrders');
let context = {};
context.awsRequestId = 'tempAwsRequestId';

describe('Test prepareShopifyOrders -', function() {
    it('Prepare prepareShopifyOrders  with success condition', function() {
        let shopifyOrders = [{ "orders": [{ "id": 4471886094 }, { "id": 4471885454 }, { "id": 4471884942 }, { "id": 4471884750 }] },
            { "orders": [{ "id": 4471884622 }, { "id": 4471884430 }, { "id": 4471884302 }, { "id": 4471884238 }] },
            { "orders": [{ "id": 4471883982 }, { "id": 4471883854 }, { "id": 4471883790 }, { "id": 4471883726 }, { "id": 4471883470 }] }
        ];
        return prepareShopifyOrders(shopifyOrders, context)
            .then(function(data) {
                expect(data).to.exist;
            });
    });
    it('Prepare prepareShopifyOrders  with iv-valid shopifyOrders array', function() {
        let shopifyOrders = [, { "orders": [{ "id": 4471886094 }, { "id": 4471885454 }] }, { "orders": [{ "id": 4471884622 }, { "id": 4471884430 }] }, { "orders": [{ "id": 4471883982 }, { "id": 4471883854 }, { "id": 4471883790 }] }];
        return prepareShopifyOrders(shopifyOrders, context)
            .then(function(data) {
                expect(data).to.not.exist;
            })
            .catch(function(err) {
                expect(err).to.exist;
                expect(err.message).to.contain('Cannot read property');
            });
    });
});