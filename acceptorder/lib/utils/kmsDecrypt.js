'use strict';

const imports = require('./imports');
const logger = imports.log4js.getLogger('kmsDecrypt');
logger.setLevel(imports.loggerLevel);

const kmsDecrypt = function(encryptedKeys, context) {
    return new imports.Bluebird((resolve, reject) => {
        try {
            let decryptedKeys = {};
            let noOfTimes = 0;
            let encryptedKeysLength = Object.keys(encryptedKeys).length;
            Object.keys(encryptedKeys).forEach(function(key) {
                let decryptParam = {
                    'CiphertextBlob': new Buffer(encryptedKeys[key], 'base64')
                };
                imports.KMS.decrypt(decryptParam, function(err, data) {
                    if (err) {
                        logger.error(`  ${context.awsRequestId}  decrypt error: ${err}`);
                        reject(err);
                    } else {
                        logger.info(`  ${context.awsRequestId}  KMS decrypt success`);
                        decryptedKeys[key] = data.Plaintext.toString();
                        noOfTimes = noOfTimes + 1;
                        if (encryptedKeysLength === noOfTimes) {
                            resolve(decryptedKeys);
                        }
                    }
                });
            });
        } catch (exception) {
            logger.error(`  ${context.awsRequestId}  kmsDecrypt exception: ${exception}`);
            reject(exception);
        }
    });
};
module.exports = kmsDecrypt;