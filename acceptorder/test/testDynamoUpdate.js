'use strict';

const chai = require('chai');
const expect = chai.expect;
const dynamoUpdate = require('../lib/utils/dynamoUpdate');
let context = {};
/*
describe('Test DynamoUpdate -', function() {
    it('Update tha Table with valid TableName and valid Condition', function() {
        var paramsWithValidTableName = {
            TableName: 'Product',
            Key: { pid: '11a' },
            UpdateExpression: 'set createdAt = :createdAt',
            ExpressionAttributeValues: {
                ':createdAt': '2017-01-26'
            }
        };
        return dynamoUpdate(paramsWithValidTableName, context)
            .then(function(data) {
                console.log(data);
                expect(data).to.exist;
            });
    });
    it('Update tha Table with in-valid TableName and valid Condition', function() {
        var paramsWithValidTableName = {
            TableName: 'InvalidTableName',
            Key: { pid: '11a' },
            UpdateExpression: 'set createdAt = :createdAt',
            ExpressionAttributeValues: {
                ':createdAt': '2017-01-26'
            }
        };
        return dynamoUpdate(paramsWithValidTableName, context)
            .then(function(data) {
                expect(data).to.not.exist;
            })
            .catch(function(err) {
                expect(err.code).to.equal('ResourceNotFoundException');
            });
    });
    it('Update tha Table with valid TableName and in-valid KeyCondition Column Name', function() {
        var paramsWithValidTableName = {
            TableName: 'Product',
            Key: { pi: '11a' },
            UpdateExpression: 'set createdAt = :createdAt',
            ExpressionAttributeValues: {
                ':createdAt': '2017-01-26'
            }
        };
        return dynamoUpdate(paramsWithValidTableName, context)
            .then(function(data) {
                expect(data).to.not.exist;
            })
            .catch(function(err) {
                expect(err.code).to.equal('ValidationException');
            });
    });
    it('Update tha Table with valid TableName and in-valid KeyCondition value', function() {
        var paramsWithValidTableName = {
            TableName: 'Product',
            Key: { pid: 11 },
            UpdateExpression: 'set createdAt = :createdAt',
            ExpressionAttributeValues: {
                ':createdAt': '2017-01-26'
            }
        };
        return dynamoUpdate(paramsWithValidTableName, context)
            .then(function(data) {
                expect(data).to.not.exist;
            })
            .catch(function(err) {
                expect(err.code).to.equal('ValidationException');
            });
    });
    it('Update tha Table with valid TableName and Invalid UpdateExpression', function() {
        var paramsWithValidTableName = {
            TableName: 'Product',
            Key: { pid: '11a' },
            UpdateExpression: 'set createdAt != :createdAt',
            ExpressionAttributeValues: {
                ':createdAt': '2017'
            }
        };
        return dynamoUpdate(paramsWithValidTableName, context)
            .then(function(data) {
                expect(data).to.not.exist;
            }).catch(function(err) {
                expect(err.code).to.equal('ValidationException');
            });
    });
    it('Update tha Table with valid TableName and Invalid key id', function() {
        var paramsWithValidTableName = {
            TableName: 'Product',
            Key: { pid: 'InvalidKeyId' },
            UpdateExpression: 'set createdAt = :createdAt',
            ExpressionAttributeValues: {
                ':createdAt': '2017'
            }
        };
        return dynamoUpdate(paramsWithValidTableName, context)
            .then(function(data) {
                expect(data).to.be.empty;
            });
    });
});*/