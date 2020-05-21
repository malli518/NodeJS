'use strict';

const AWS = require('aws-sdk');
const AWS_REGION = process.env.AWS_REGION || 'us-west-2';
const KMS = new AWS.KMS({
    region: AWS_REGION
});
const crypto = require('crypto');
const Bluebird = require('bluebird');
const kinesis = new AWS.Kinesis({
    region: AWS_REGION
});
AWS.config.update({
    region: AWS_REGION
});
const shopifyAPI = require('shopify-node-api');
const log4js = require('log4js');
log4js.configure('logging/log4js.json');
const loggerLevel = process.env.loggerLevel || 'DEBUG';
const Lambda = new AWS.Lambda({
    region: AWS_REGION
});
const docClient = new AWS.DynamoDB.DocumentClient();
const SNS = new AWS.SNS({
    region: AWS_REGION
});
const SES = new AWS.SES({
    region: AWS_REGION,
});
const moment = require('moment');
const momentTimezone = require('moment-timezone');
const twix = require('twix');
const dateFormat = 'YYYY-MM-DD';
let dateTimeFormatT = 'YYYY-MM-DDTHH:mm:ss';
const yearMonthFormat = 'YYYYMM';
// calculate the maximum amount of data to accumulate before emitting to
// kinesis. 1MB - 16 bytes for checksum
const KINESIS_MAX_PAYLOAD_BYTES = 1048576 - 16;
const json2csv = require('json2csv');
const underscore = require('underscore');

module.exports = {
    AWS: AWS,
    KMS: KMS,
    kinesis: kinesis,
    Bluebird: Bluebird,
    crypto: crypto,
    Lambda: Lambda,
    shopifyAPI: shopifyAPI,
    log4js: log4js,
    loggerLevel: loggerLevel,
    docClient: docClient,
    SNS: SNS,
    SES: SES,
    moment: moment,
    momentTimezone: momentTimezone,
    twix: twix,
    dateFormat: dateFormat,
    dateTimeFormatT: dateTimeFormatT,
    yearMonthFormat: yearMonthFormat,
    KINESIS_MAX_PAYLOAD_BYTES: KINESIS_MAX_PAYLOAD_BYTES,
    json2csv: json2csv,
    underscore: underscore
};