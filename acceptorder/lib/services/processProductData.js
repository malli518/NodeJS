'use strict';

const imports = require('../utils/imports');
const dynamoPut = require('../utils/dynamoPut');

const logger = imports.log4js.getLogger('processProductData');
logger.setLevel(imports.loggerLevel);

const processProductData = function(productInfo, context) {
    return new imports.Bluebird((resolve, reject) => {
        let productTableName = process.env.ProductsTableName;
        try {
            logger.debug('Creating product');
            let params = {
                TableName: productTableName,
                Item: productInfo
            };
            dynamoPut(params, context).then(data => {
                logger.debug(` ${context.awsRequestId} Succeessfully processed product event: ${JSON.stringify(data)} `);
                resolve(data);

            }).catch(err => {
                logger.error(`${context.awsRequestId}  processProductData err: ${err}`);
                reject(err);
            });
        } catch (exception) {
            logger.error(`${context.awsRequestId}  processProductData exception: ${exception}`);
            reject(exception);
        }
    });
};

module.exports = processProductData;