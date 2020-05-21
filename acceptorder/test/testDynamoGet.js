'use strict';

const chai = require('chai');
const expect = chai.expect;
const dynamoGet = require('../lib/utils/dynamoGet');
let context = {};

describe('Test dynamoGet -', function() {
    it('Get the  records from DB with valid TableName and valid Key Condition', function() {
        let paramsWithValidTableName = {
            TableName: 'psProductsInfoTable',
            Key: {
                Id: '7037561413'
            }
        };
        return dynamoGet(paramsWithValidTableName, context)
            .then(function(data) {
                // console.log(data);
                expect(data).to.exist;
            });
    });
    it('Get the  records from DB with in-valid TableName and valid Key Condition', function() {
        let paramsWithValidTableName = {
            TableName: 'InvalidTableName',
            Key: {
                Id: '7037561413'
            }
        };
        return dynamoGet(paramsWithValidTableName, context)
            .then(function(data) {
                expect(data).to.not.exist;
            })
            .catch(function(err) {
                expect(err.code).to.equal('ResourceNotFoundException');
            });
    });
    it('Get the  records from DB with valid TableName and in-valid Key Condition column Name', function() {
        let paramsWithValidTableName = {
            TableName: 'psProductsInfoTable',
            Key: {
                invalidColumnName: '7037561413'
            }
        };
        return dynamoGet(paramsWithValidTableName, context)
            .then(function(data) {
                expect(data).to.not.exist;
            })
            .catch(function(err) {
                expect(err.code).to.equal('ValidationException');
            });
    });
    it('Get the  records from DB with valid TableName and in-valid Key Condition Value', function() {
        let paramsWithValidTableName = {
            TableName: 'psProductsInfoTable',
            Key: {
                Id: 7037561413
            }
        };
        return dynamoGet(paramsWithValidTableName, context)
            .then(function(data) {
                expect(data).to.not.exist;
            })
            .catch(function(err) {
                expect(err.code).to.equal('ValidationException');
            });
    });
    it('Get the  records from DB with valid TableName and valid Key Condition empty object', function() {
        let paramsWithValidTableName = {
            TableName: 'psProductsInfoTable',
            Key: {
                Id: '9037561413'
            }
        };
        return dynamoGet(paramsWithValidTableName, context)
            .then(function(data) {
                console.log(data);
                expect(data).to.be.empty;
            });
    });
});