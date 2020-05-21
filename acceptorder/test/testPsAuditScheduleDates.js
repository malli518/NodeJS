'use strict';

const chai = require('chai');
const expect = chai.expect;
const psAuditScheduleDates = require('../lib/utils/psAuditScheduleDates');
const imports = require('../lib/utils/imports');
let context = {};
context.awsRequestId = 'tempAwsRequestId';

describe('Test psAuditScheduleDates -', function() {
    it('get the scheduledates from DB with success state.', function() {
        let scheduleFromDate = imports.moment().startOf('day').format(imports.dateTimeFormatT);
        var scheduleToDate = imports.moment().startOf('day').subtract(1, 'seconds').format(imports.dateTimeFormatT);
        let param = {
            TableName: 'psAuditSchedulerTable',
            KeyConditionExpression: 'Id = :id',
            ExpressionAttributeValues: {
                ':id': 'CreateOrder'
            },
            Limit: 1,
            ScanIndexForward: false //descending order..
        };
        return psAuditScheduleDates(param, context)
            .then(function(data) {
                console.log('data=' + JSON.stringify(data));
                expect(data.scheduleToDate).to.equal(scheduleToDate);
                expect(data.scheduleFromDate).to.equal(scheduleFromDate);
            });
    });
    it('get the scheduledates from DB with invalid Key Condition ID', function() {
        var invalidScheduleFromDate = imports.moment().startOf('day').subtract(1, 'days').format(imports.dateTimeFormatT);
        var scheduleToDate = imports.moment().startOf('day').subtract(1, 'seconds').format(imports.dateTimeFormatT);
        console.log('ScheduleFromDate==   ' + invalidScheduleFromDate + '   scheduleToDate===' + scheduleToDate);
        let param = {
            TableName: 'psAuditSchedulerTable',
            KeyConditionExpression: 'Id = :id',
            ExpressionAttributeValues: {
                ':id': 'InvalidCreateOrder'
            },
            Limit: 1,
            ScanIndexForward: false //descending order..
        };
        return psAuditScheduleDates(param, context)
            .then(function(data) {
                console.log('Data =' + JSON.stringify(data));
                expect(data.scheduleToDate).to.equal(scheduleToDate);
                expect(data.scheduleFromDate).to.equal(invalidScheduleFromDate);
            });
    });
    it('get the scheduledates from DB with invalid TableName', function() {
        let param = {
            TableName: 'InvalidPsAuditScheduleTable',
            KeyConditionExpression: 'Id = :id',
            ExpressionAttributeValues: {
                ':id': 'CreateOrder'
            },
            Limit: 1,
            ScanIndexForward: false //descending order..
        };
        return psAuditScheduleDates(param, context)
            .then(function(data) {
                expect(data).to.not.exist;
            })
            .catch(function(err) {
                expect(err.code).to.equal('ResourceNotFoundException');
            });
    });
    it('get the scheduledates from DB with invalid KeyCondition Expression', function() {
        let param = {
            TableName: 'psAuditScheduleTable',
            KeyConditionExpression: 'Id != :id',
            ExpressionAttributeValues: {
                ':id': 'CreateOrder'
            },
            Limit: 1,
            ScanIndexForward: false //descending order..
        };
        return psAuditScheduleDates(param, context)
            .then(function(data) {
                expect(data).to.not.exist;
            })
            .catch(function(err) {
                expect(err.code).to.equal('ValidationException');
            });
    });
    it('get the scheduledates from DB with invalid param', function() {
        let param = {
            TableName: 'psAuditScheduleTable',
            //KeyConditionExpression: 'Id != :id',
            ExpressionAttributeValues: {
                ':id': 'CreateOrder'
            },
            Limit: 1,
            ScanIndexForward: false //descending order..
        };
        return psAuditScheduleDates(param, context)
            .then(function(data) {
                expect(data).to.not.exist;
            })
            .catch(function(err) {
                expect(err.code).to.equal('ValidationException');
            });
    });
});
//npm test test/testPsAuditScheduleDates