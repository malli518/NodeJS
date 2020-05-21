'use strict';

const chai = require('chai');
const expect = chai.expect;
const simpleNotificationService = require('../lib/utils/simpleNotificationService');
let context = {};
context.awsRequestId = 'tempAwsRequestId';
describe('Test simpleNotificationService -', function() {
    it('simpleNotificationService with success state', function() {
        let params = {
            TargetArn: 'arn:aws:sns:us-west-2:781812356504:perfectSip-dev-AcceptOrderErrorSNS-H3PVL49490TX',
            Message: 'AcceptOrderErrorSNS Test',
            Subject: 'AcceptOrder - Test Error'
        };
        return simpleNotificationService(params, context)
            .then(function(data) {
                console.log(JSON.stringify(data));
                expect(data).to.exist;
            });
    });
    it('simpleNotificationService with invalid TargetArn', function() {
        let params = {
            TargetArn: 'arn:aws:sns:us-west-2:781812356504:perfectSip-dev-AcceptOrderErrorSNS',
            Message: 'AcceptOrderErrorSNS Test',
            Subject: 'AcceptOrder - Test Error'
        };
        return simpleNotificationService(params, context)
            .then(function(data) {
                console.log(JSON.stringify(data));
                expect(data).to.not.exist;
            }).catch(function(err) {
                console.log(err.message);
                expect(err.statusCode).to.equal(404);
            });
    });
    it('simpleNotificationService with valid Topic Name', function() {
        let params = {
            TargetArn: 'AcceptOrderErrorSNS',
            Message: 'AcceptOrderErrorSNS Test',
            Subject: 'AcceptOrder - Test Error'
        };
        return simpleNotificationService(params, context)
            .then(function(data) {
                console.log(JSON.stringify(data));
                expect(data).to.not.exist;
            }).catch(function(err) {
                console.log(err.message);
                expect(err.statusCode).to.equal(400);
            });
    });
    it('simpleNotificationService with out Message', function() {
        let params = {
            TargetArn: 'arn:aws:sns:us-west-2:781812356504:perfectSip-dev-AcceptOrderErrorSNS-H3PVL49490TX',
            // Message: 'AcceptOrderErrorSNS Test',
            Subject: 'AcceptOrder - Test Error'
        };
        return simpleNotificationService(params, context)
            .then(function(data) {
                console.log(JSON.stringify(data));
                expect(data).to.not.exist;
            }).catch(function(err) {
                expect(err.code).to.equal('MissingRequiredParameter');
            });
    });
    it('simpleNotificationService with out Subject', function() {
        let params = {
            TargetArn: 'arn:aws:sns:us-west-2:781812356504:perfectSip-dev-AcceptOrderErrorSNS-H3PVL49490TX',
            Message: 'AcceptOrderErrorSNS Test',
            //Subject: 'AcceptOrder - Test Error'
        };
        return simpleNotificationService(params, context)
            .then(function(data) {
                console.log(JSON.stringify(data));
                expect(data).to.not.exist;
            }).catch(function(err) {
                expect(err.message).to.equal('expected { Object (ResponseMetadata, MessageId) } to not exist');
            });
    });
});
//npm test test/testSimpleNotificationService