'use strict';

const chai = require('chai');
const expect = chai.expect;
const dynamoPut = require('../lib/utils/dynamoPut');
let context = {};

describe('Test dynamoPut-', function() {
    // it('Put records into DB with valid TableName and Key ID', function() {
    //     let paramwithvalidtable = {
    //         TableName: 'psAuditOrdersTable',
    //         Item: {
    //             'Id': 'shardId-000000000003:49568841485573015014435384984062256068402672366052704309',
    //             'OrderId': 4467541371
    //         }
    //     };
    //     return dynamoPut(paramwithvalidtable, context)
    //         .then(function(data) {
    //             console.log(data);
    //             expect(data).to.exist;
    //         });
    // });
    it('Put records into DB with in-valid TableName and Key ID', function() {
        let paramwithinvalidtable = {
            TableName: 'psAuditOrdersTable11',
            Item: {
                'Id': 'shardId-000000000003:49568841485573015014435384984062256068402672366052704309',
                'OrderId': 4467541372,
            }
        };
        return dynamoPut(paramwithinvalidtable, context)
            .then(function(data) {
                expect(data).to.not.exist;
            })
            .catch(function(err) {
                expect(err.code).to.equal('ResourceNotFoundException');
            });
    });
    it('Put records into DB with valid table name, without key Id', function() {
        let paramwithoutkey = {
            TableName: 'psAuditOrdersTable',
            Item: {
                'OrderId': 4467541373,
            }
        };
        return dynamoPut(paramwithoutkey, context)
            .then(function(data) {
                expect(data).to.not.exist;
            })
            .catch(function(err) {
                expect(err.code).to.equal('ValidationException');
            });
    });
    it('Put records into DB with valid table name, with invalid OrderID', function() {
        let paramwithoutkey = {
            TableName: 'psAuditOrdersTable',
            Item: {
                'Id': 'shardId-000000000003:49568841485573015014435384984062256068402672366052704309',
                'OrderId': '4467541373',
            }
        };
        return dynamoPut(paramwithoutkey, context)
            .then(function(data) {
                expect(data).to.not.exist;
            })
            .catch(function(err) {
                expect(err.code).to.equal('ValidationException');
            });
    });
});