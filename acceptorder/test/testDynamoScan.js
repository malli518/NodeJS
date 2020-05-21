'use strict';

const chai = require('chai');
const expect = chai.expect;
const dynamoScan = require('../lib/utils/dynamoScan');
let context = {};

describe('Test dynamoScan -', function() {
    it('Scan with valid TableName', function() {
        let paramwithtablename = {
            TableName: 'psAuditOrdersTable',
            FilterExpression: 'ShopifyCreated = :shopifyCreated',
            ExpressionAttributeValues: { ':shopifyCreated': '2017-01-05' }
        };
        return dynamoScan(paramwithtablename, context)
            .then(function(data) {
                console.log(data);
                expect(data).to.exist;
            });
    });
    it('Scan with invalid TableName', function() {
        let paramwithouttablename = {
            TableName: 'psAuditOrdersTable1',
            FilterExpression: 'ShopifyCreated = :shopifyCreated',
            ExpressionAttributeValues: { ':shopifyCreated': '2017-01-05' }
        };
        return dynamoScan(paramwithouttablename, context)
            .then(function(data) {
                expect(data).to.not.exist;
            })
            .catch(function(err) {
                expect(err.code).to.equal('ResourceNotFoundException');
            });
    });
    it('Scan with valid TableName and invalid expression', function() {
        let paramwithouttablename = {
            TableName: 'psAuditOrdersTable',
            FilterExpression: 'ShopifyCreated != :shopifyCreated',
            ExpressionAttributeValues: { ':shopifyCreated': '2017' }
        };
        return dynamoScan(paramwithouttablename, context)
            .then(function(data) {
                expect(data).to.not.exist;
            })
            .catch(function(err) {
                expect(err.code).to.equal('ValidationException');
            });
    });
});