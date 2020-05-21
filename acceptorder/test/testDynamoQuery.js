'use strict';

const chai = require('chai');
const expect = chai.expect;
const dynamoQuery = require('../lib/utils/dynamoQuery');
let context = {};

describe('Test dynamoQuery -', function() {
    it('Query with valid TableName and valid Indexname', function() {
        let paramwithtablename = {
            TableName: 'psAuditOrdersTable',
            IndexName: 'OrderId-index',
            KeyConditionExpression: 'OrderId = :orderId',
            ExpressionAttributeValues: {
                ':orderId': 4467541390
            },
            ProjectionExpression: 'OrderId',
        };
        return dynamoQuery(paramwithtablename, context)
            .then(function(data) {
                expect(data).to.exist;
            });
    });
    it('Query with in-valid TableName and valid index name', function() {
        let paramwithouttablename = {
            TableName: 'InvalidTableName',
            IndexName: 'OrderId-index',
            KeyConditionExpression: 'OrderId = :orderId',
            ExpressionAttributeValues: {
                ':orderId': 4467541390,
            },
            ProjectionExpression: 'OrderId',
        };
        return dynamoQuery(paramwithouttablename, context)
            .then(function(data) {
                expect(data).to.not.exist;
            })
            .catch(function(err) {
                expect(err.code).to.equal('ResourceNotFoundException');
            });
    });
    it('Query with valid TableName and in-valid indexname', function() {
        let paramwithinvalidindex = {
            TableName: 'psAuditOrdersTable',
            IndexName: 'InvalidIndexName',
            KeyConditionExpression: 'OrderId = :orderId',
            ExpressionAttributeValues: {
                ':orderId': 4467541390
            },
            ProjectionExpression: 'OrderId',
        };
        return dynamoQuery(paramwithinvalidindex, context)
            .then(function(data) {
                expect(data).to.not.exist;
            })
            .catch(function(err) {
                expect(err.code).to.equal('ValidationException');
            });
    });
    it('Query with valid TableName,valid indexname and in-valid key condition', function() {
        let paramwithinvalidkeycondition = {
            TableName: 'psAuditOrdersTable',
            IndexName: 'OrderId-index',
            KeyConditionExpression: 'OrderId != :orderId',
            ExpressionAttributeValues: {
                ':orderId': 4467541390
            },
            ProjectionExpression: 'OrderId',
        };
        return dynamoQuery(paramwithinvalidkeycondition, context)
            .then(function(data) {
                expect(data).to.not.exist;
            })
            .catch(function(err) {
                expect(err.code).to.equal('ValidationException');
            });
    });
    it('Query with valid TableName,valid indexname and in-valid expression', function() {
        let paramwithinvalidexpression = {
            TableName: 'psAuditOrdersTable',
            IndexName: 'OrderId-index',
            KeyConditionExpression: 'OrderId = :orderId',
            ExpressionAttributeValues: {
                ':orderId': '4467541390'
            },
            ProjectionExpression: 'OrderId',
        };
        return dynamoQuery(paramwithinvalidexpression, context)
            .then(function(data) {
                expect(data).to.not.exist;
            })
            .catch(function(err) {
                expect(err.code).to.equal('ValidationException');
            });
    });
});