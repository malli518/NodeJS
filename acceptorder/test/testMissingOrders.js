'use strict';

const chai = require('chai');
const expect = chai.expect;
const missingOrders = require('../lib/utils/missingOrders');
let context = {};

describe('Test missingOrders -', function() {
    it('identify missingOrders', function() {
        let shopifyOrders = [4467541368, 4467541369, 4467541370, 4467541371, 4467541372, 4467541373, 4467541374];
        let dynamoOrders = [4467541370, 4467541371, 4467541372, 4467541373, 4467541374];
        return missingOrders(shopifyOrders, dynamoOrders, context)
            .then(function(data) {
                console.log(data);
                expect(data).to.exist;
            });
    });
    it('identify missingOrders with invalid dynamo array', function() {
        let shopifyOrders = [4467541369, 4467541370, 4467541371, 4467541372, 4467541373, 4467541374];
        let dynamoOrders = {
            'OrderId': [4467541369, 4467541370, 4467541371, 4467541372, 4467541373, 4467541374]
        };
        return missingOrders(shopifyOrders, dynamoOrders, context)
            .then(function(data) {
                expect(data).to.not.exist;
            }).catch(function(err) {
                expect(err.message).to.contain('a.indexOf is not a function');
            });
    });
    it('identify missingOrders with invalid shopify array', function() {
        let dynamoOrders = [4467541369, 4467541370, 4467541371, 4467541372, 4467541373, 4467541374];
        let shopifyOrders = {
            'OrderId': [4467541369, 4467541370, 4467541371, 4467541372, 4467541373, 4467541374]
        };
        return missingOrders(shopifyOrders, dynamoOrders, context)
            .then(function(data) {
                expect(data).to.not.exist;
            }).catch(function(err) {
                expect(err.message).to.contain('shopifyOrders.diff is not a function');
            });
    });
});