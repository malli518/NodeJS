'use strict';

const imports = require('./lib/utils/imports');
const logger = imports.log4js.getLogger('getRecordsFromOrderTable');
logger.setLevel(imports.loggerLevel);

module.exports.getRecordsFromOrderTable = (event, context, callback) => {
try {
    let params = {
        "TableName": "psAuditOrdersTable",
        "ScanFilter": {
            "ShopifyCreatedDate": {
            "AttributeValueList": [
                {
                "S": "2017-01-03"
                }
            ],
            "ComparisonOperator": "IN"
            }
        }
    }
    imports.docClient.scan(params, (err, data) => {
        if (err) {
            logger.error(` ${context.awsRequestId}  dynamoQuery error: ${err}`);
            callback(err);
        } else {
            console.log(data);
            callback(null, "Successfully Extracted");
        }
    });
    } catch (exception) {
        logger.error(`  ${context.awsRequestId}  dynamoQuery exception: ${exception}`);
        callback(exception);
    }

}