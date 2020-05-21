'use strict';

const imports = require('./imports');
const logger = imports.log4js.getLogger('prepareMetaFields');
logger.setLevel(imports.loggerLevel);

const prepareMetaFields = function(items, productMetafields, context) {
    return new imports.Bluebird((resolve, reject) => {
        try {
            for (let i = 0; i < productMetafields.metafields.length; i++) {
                let keyColumn = productMetafields.metafields[i].namespace + '_' + productMetafields.metafields[i].key;
                items[keyColumn] = productMetafields.metafields[i].value;
            }
            resolve(items);
        } catch (exception) {
            logger.error(`  ${context.awsRequestId}  prepareMetaFields exception: ${exception}`);
            reject(exception);
        }
    });
};
module.exports = prepareMetaFields;