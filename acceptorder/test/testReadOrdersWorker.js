'use strict';

const chai = require('chai');
const expect = chai.expect;
const readOrdersWorker = require('../lib/services/readOrdersWorker');
let context = {};
context.awsRequestId = 'tempAwsRequestId';
let event = {};
let exclusiveStartKey = null;

describe('Test readOrdersWorker', function() {
    it('Read the  Orderds from DB ', function() {
        process.env.createdDate = '2017-01-27';
        process.env.OrdersTableName = 'psAuditOrdersTable';
        return readOrdersWorker(exclusiveStartKey, event, context)
            .then(function(data) {
                console.log(JSON.stringify(data));
                expect(data).to.exist;
            });
    });
    it('Read the  Orderds from DB with in-valid TableName', function() {
        process.env.createdDate = '2017-01-27';
        process.env.OrdersTableName = 'psAuditOrdersTable1';
        return readOrdersWorker(exclusiveStartKey, event, context)
            .then(function(data) {
                expect(data).to.not.exist;
            })
            .catch(function(err) {
                expect(err.code).to.equal('ResourceNotFoundException');
            });
    });
    it('Read the  Orderds from DB with empty Object test', function() {
        process.env.createdDate = '2017-01-29';
        process.env.OrdersTableName = 'psAuditOrdersTable';
        return readOrdersWorker(exclusiveStartKey, event, context)
            .then(function(data) {
                console.log(data);
                console.log(data[0].Items);
                console.log(data[0].Count);
                expect(data[0].Count).to.equal(0);
                // expect(data).to.be.empty;
            });
    });
    it('Read the  Orderds from DB with invalid exclusiveStartKey', function() {
        let exclusiveStartKey = 'null';
        process.env.createdDate = '2017-01-29';
        process.env.OrdersTableName = 'psAuditOrdersTable';
        return readOrdersWorker(exclusiveStartKey, event, context)
            .then(function(data) {
                expect(data).to.not.exist;
            })
            .catch(function(err) {
                expect(err.code).to.equal('ValidationException');
            });
    });
    afterEach(function() {
        delete process.env.createdDate;
        delete process.env.OrdersTableName;
    });
});
//npm test test/testReadOrdersWorker