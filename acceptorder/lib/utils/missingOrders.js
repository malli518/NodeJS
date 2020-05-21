'use strict';

const imports = require('./imports');
const logger = imports.log4js.getLogger('missingOrders');
logger.setLevel(imports.loggerLevel);

const missingOrders = function(shopifyOrders, dynamoOrders, context) {
    return new imports.Bluebird((resolve, reject) => {
        try {
            resolve(shopifyOrders.diff(dynamoOrders));
        } catch (exception) {
            logger.error(`  ${context.awsRequestId}  missingOrders exception: ${exception}`);
            reject(exception);
        }
    });
};

Array.prototype.diff = function(a) {
    return this.filter(function(i) { return a.indexOf(i) < 0; });
};

module.exports = missingOrders;