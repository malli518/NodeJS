'use strict';

const chai = require('chai');
const expect = chai.expect;
const simpleEmailService = require('../lib/utils/simpleEmailService');
let context = {};
context.awsRequestId = 'tempAwsRequestId';
describe('Test simpleEmailService -', function() {
    it('simpleEmailService with success state', function() {
        let prepareMailBody = 'NagamalleswaraRao Gannavarapu with email address malli.lead518@gmail.com from phone 9553583771  has expressed interest in joining PerfectSip Team.';
        let params = {
            Destination: {
                ToAddresses: ['ngannavarapu@rythmos.com']
            },
            Message: {
                Body: {
                    Html: {
                        Data: '<p>' + prepareMailBody + '</p>'
                    }
                },
                Subject: {
                    Data: 'Curator enrollment'
                }
            },
            Source: 'malli.lead518@gmail.com',
            ReplyToAddresses: ['malli.lead518@gmail.com'],
            ReturnPath: 'malli.lead518@gmail.com'
        };
        return simpleEmailService(params, context)
            .then(function(data) {
                console.log(JSON.stringify(data));
                expect(data).to.exist;
            });
    });
    it('simpleEmailService with unsubscribed ToAddresses', function() {
        let prepareMailBody = 'NagamalleswaraRao Gannavarapu with email address malli.lead518@gmail.com from phone 9553583771  has expressed interest in joining PerfectSip Team.';
        let params = {
            Destination: {
                ToAddresses: ['rchimata@rythmos.com']
            },
            Message: {
                Body: {
                    Html: {
                        Data: '<p>' + prepareMailBody + '</p>'
                    },
                    Text: {
                        Data: prepareMailBody
                    }
                },
                Subject: {
                    Data: 'Curator enrollment'
                }
            },
            Source: 'malli.lead518@gmail.com',
            ReplyToAddresses: ['malli.lead518@gmail.com'],
            ReturnPath: 'malli.lead518@gmail.com'
        };
        return simpleEmailService(params, context)
            .then(function(data) {
                console.log(JSON.stringify(data));
                expect(data).to.not.exist;
            }).catch(function(err) {
                // console.log(err);
                //console.log(err.statusCode);
                expect(err.statusCode).to.equal(400);
            });
    });
    it('simpleEmailService with unsubscribed FromAddresses', function() {
        let prepareMailBody = 'NagamalleswaraRao Gannavarapu with email address malli.lead518@gmail.com from phone 9553583771  has expressed interest in joining PerfectSip Team.';
        let params = {
            Destination: {
                ToAddresses: ['ngannavarapu@rythmos.com']
            },
            Message: {
                Body: {
                    Html: {
                        Data: '<p>' + prepareMailBody + '</p>'
                    },
                    Text: {
                        Data: prepareMailBody
                    }
                },
                Subject: {
                    Data: 'Curator enrollment'
                }
            },
            Source: 'abc@gmail.com',
            ReplyToAddresses: ['malli.lead518@gmail.com'],
            ReturnPath: 'abc@gmail.com'
        };
        return simpleEmailService(params, context)
            .then(function(data) {
                console.log(JSON.stringify(data));
                expect(data).to.not.exist;
            }).catch(function(err) {
                // console.log(err);
                //console.log(err.statusCode);
                expect(err.statusCode).to.equal(400);
            });
    });
    it('simpleEmailService with out Message Body', function() {
        let prepareMailBody = 'NagamalleswaraRao Gannavarapu with email address malli.lead518@gmail.com from phone 9553583771  has expressed interest in joining PerfectSip Team.';
        let params = {
            Destination: {
                ToAddresses: ['ngannavarapu@rythmos.com']
            },
            // Message: {
            //     Body: {
            //         Html: {
            //             Data: '<p>' + prepareMailBody + '</p>'
            //         }
            //     },
            //     Subject: {
            //         Data: 'Curator enrollment'
            //     }
            // },
            Source: 'malli.lead518@gmail.com',
            ReplyToAddresses: ['malli.lead518@gmail.com'],
            ReturnPath: 'malli.lead518@gmail.com'
        };
        return simpleEmailService(params, context)
            .then(function(data) {
                console.log(JSON.stringify(data));
                expect(data).to.not.exist;
            }).catch(function(err) {
                //console.log(err);
                // console.log(err.code);
                expect(err.code).to.equal('MissingRequiredParameter');
            });
    });
});
//npm test test/testSimpleEmailService