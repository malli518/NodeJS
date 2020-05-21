'use strict';

const chai = require('chai');
const expect = chai.expect;
const dynamoDelete = require('../lib/utils/dynamoDelete');
let context = {};
/*
describe('Test dynamoDelete -', function() {
    it('Delete records from DB with valid TableName and valid Key ID', function() {
        let paramsWithValidTableName = {
            TableName: 'Product',
            Key: {
                pid: '100a'
            }
        };
        return dynamoDelete(paramsWithValidTableName, context)
            .then(function(data) {
                console.log(data);
                expect(data).to.exist;
            });
    });
    it('Delete records from DB with valid TableName, valid Key ID with   empty Object', function() {
        let paramsWithValidTableName = {
            TableName: 'Product',
            Key: {
                pid: '100a'
            }
        };
        return dynamoDelete(paramsWithValidTableName, context)
            .then(function(data) {
                console.log(data);
                expect(data).to.be.empty;
            });
    });
    it('Delete records from DB with in-Valid TableName', function() {
        let paramsWithinValidTableName = {
            TableName: 'Product1',
            Key: {
                pid: '100a'
            }
        };
        return dynamoDelete(paramsWithinValidTableName, context)
            .then(function(data) {
                expect(data).to.not.exist;
            })
            .catch(function(err) {
                expect(err.code).to.equal('ResourceNotFoundException');
            });
    });
    it('Delete records from DB with valid TableName and in-valid Key Condition column Name', function() {
        let paramsWithinValidKeyCondition = {
            TableName: 'Product',
            Key: {
                pi: '100a'
            }
        };
        return dynamoDelete(paramsWithinValidKeyCondition, context)
            .then(function(data) {
                expect(data).to.not.exist;
            })
            .catch(function(err) {
                expect(err.code).to.equal('ValidationException');
            });
    });
    it('Delete records from DB with valid TableName and in-valid key condition', function() {
        let paramsWithValidTableName = {
            TableName: 'Product',
            Key: {
                pid: 100
            }
        };
        return dynamoDelete(paramsWithValidTableName, context)
            .then(function(data) {
                expect(data).to.not.exist;
            })
            .catch(function(err) {
                expect(err.code).to.equal('ValidationException');
            });
    });
});*/