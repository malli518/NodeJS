'use strict';

const imports = require('./lib/utils/imports');
const responseCodes = require('./lib/utils/responseCodes');
const simpleEmailService = require('./lib/utils/simpleEmailService');

const logger = imports.log4js.getLogger('curatorEnrollment');
logger.setLevel(imports.loggerLevel);

module.exports.curatorEnrollment = (event, context, callback) => {
    logger.debug(`event: ${JSON.stringify(event)}`);
    let response = {};
    let headers = {};
    headers['Access-Control-Allow-Origin'] = '*';
    response['headers'] = headers;
    try {
        logger.debug(`${context.awsRequestId}  Check event body is empty ot not`);
        if (!imports.underscore.isEmpty(event.body)) {
            logger.debug(`${context.awsRequestId} Event body is not empty`);
            let body;
            if (typeof event.body === 'object') {
                body = event.body;
            } else {
                body = JSON.parse(event.body);
            }
            let firstName = body.firstName;
            let lastName = body.lastName;
            let email = body.email;
            let phone = body.phone;
            if (firstName && lastName && email && phone) {
                logger.debug(`${context.awsRequestId} Required param(s) are not empty`);
                let prepareMailBody = firstName + ' ' + lastName + ' with email address ' + email + ' from phone ' + phone + ' has expressed interest in joining PerfectSip Team.';
                let params = {
                    Destination: {
                        ToAddresses: [process.env.sesEmail]
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
                    Source: process.env.sesSource,
                    ReplyToAddresses: [process.env.sesReplyToAddresses],
                    ReturnPath: process.env.sesReturnPath
                };
                simpleEmailService(params, context).then(data => {
                    logger.debug(`${context.awsRequestId} SimpleEmailService is success ${JSON.stringify(data)}`);
                    //prepare response object
                    response['statusCode'] = responseCodes.SUCCESS;
                    return callback(null, response);
                }).catch(err => {
                    logger.error(`${context.awsRequestId}  curatorEnrollment  err: ${err}`);
                    response['statusCode'] = responseCodes.INTERNALERROR;
                    return callback(null, response);
                });
            } else {
                logger.error(`${context.awsRequestId}  curatorEnrollment  required parameter(s) are empty`);
                response['statusCode'] = responseCodes.BADREQUEST;
                return callback(null, response);
            }
        } else {
            logger.error(`${context.awsRequestId}  curatorEnrollment  event body is empty`);
            response['statusCode'] = responseCodes.BADREQUEST;
            return callback(null, response);
        }
    } catch (exception) {
        logger.error(`${context.awsRequestId}  curatorEnrollment  exception: ${exception}`);
        response['statusCode'] = responseCodes.INTERNALERROR;
        return callback(null, response);
    }
};