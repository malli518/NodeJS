'use strict';

const chai = require('chai');
const expect = chai.expect;
const getShopifyCancelledOrderIds = require('../lib/utils/getShopifyCancelledOrderIds');
let context = {};
context.awsRequestId = 'tempAwsRequestId';

describe('Test getShopifyCancelledOrderIds', function() {
    it('Prepare ShopifyCancelledOrderIds  with success condition', function() {
        let shopifyOrders = [{ "orders": [{ "id": 4491886990, "cancelled_at": "2017-01-03T12:14:36-05:00" }, { "id": 4491886158, "cancelled_at": "2017-01-03T12:14:37-05:00" }] },
            { "orders": [{ "id": 4491885582, "cancelled_at": "2017-01-03T12:14:35-05:00" }, { "id": 4491885838, "cancelled_at": "2017-01-03T12:14:36-05:00" }] },
            { "orders": [{ "id": 4491885518, "cancelled_at": "2017-01-03T12:14:36-05:00" }, { "id": 4491885774, "cancelled_at": "2017-01-03T12:14:35-05:00" }] }
        ];
        let shopifyScheduleDates = {
            scheduleFromDate: '2017-01-03T00:00:00',
            scheduleToDate: '2017-01-03T23:59:59',
            lastRunDate: '2017-01-03T23:59:59'
        };
        getShopifyCancelledOrderIds(shopifyOrders, shopifyScheduleDates, context)
            .then(function(data) {
                console.log(data);
                expect(data).to.exist;
            });
    });
    it('Prepare ShopifyCancelledOrderIds  with in-valid shopifyOrders array', function() {
        let shopifyOrders = [, { "orders": [{ "id": 4491886990, "cancelled_at": "2017-01-03T12:14:36-05:00" }, { "id": 4491886158, "cancelled_at": "2017-01-03T12:14:37-05:00" }] },
            { "orders": [{ "id": 4491885582, "cancelled_at": "2017-01-03T12:14:35-05:00" }, { "id": 4491885838, "cancelled_at": "2017-01-03T12:14:36-05:00" }] },
            { "orders": [{ "id": 4491885518, "cancelled_at": "2017-01-03T12:14:36-05:00" }, { "id": 4491885774, "cancelled_at": "2017-01-03T12:14:35-05:00" }] }
        ];
        let shopifyScheduleDates = {
            scheduleFromDate: '2017-01-03T00:00:00',
            scheduleToDate: '2017-01-03T23:59:59',
            lastRunDate: '2017-01-03T23:59:59'
        };
        getShopifyCancelledOrderIds(shopifyOrders, shopifyScheduleDates, context)
            .then(function(data) {
                expect(data).to.not.exist;
            })
            .catch(function(err) {
                expect(err).to.exist;
                expect(err.message).to.contain('Cannot read property');
            });
    });
});