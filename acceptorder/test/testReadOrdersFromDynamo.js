'use strict';

const chai = require('chai');
const expect = chai.expect;
const readOrdersFromDynamo = require('../lib/services/readOrdersFromDynamo');
let context = {};
context.awsRequestId = 'tempAwsRequestId';
let event = {};
let exclusiveStartKey = null;
describe('Test readOrdersFromDynamo -', function() {
    it('Read Orders From from Dynamo with valid table name ', function() {
        process.env.createdDate = '2017-01-27';
        process.env.OrdersTableName = 'psAuditOrdersTable';
        return readOrdersFromDynamo(exclusiveStartKey, event, context)
            .then(function(data) {
                // console.log(JSON.stringify(data));
                expect(data).to.exist;

            });
    });
    it('Read Orders From from Dynamo with in valid table name ', function() {
        process.env.createdDate = '2017-01-27';
        process.env.OrdersTableName = 'InvalidTableName';
        return readOrdersFromDynamo(exclusiveStartKey, event, context)
            .then(function(data) {
                expect(data).to.not.exist;
            }).catch(function(err) {
                expect(err.code).to.equal('ResourceNotFoundException');
            });
    });
    it('Read the  Orderds from DB with empty Object test', function() {
        process.env.createdDate = '2017-01-29';
        process.env.OrdersTableName = 'psAuditOrdersTable';
        return readOrdersFromDynamo(exclusiveStartKey, event, context)
            .then(function(data) {
                expect(data.Count).to.equal(0);
                // expect(data).to.be.empty;
            });
    });
});
//npm test test/testReadOrdersFromDynamo.js