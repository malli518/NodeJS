'use strict';

const chai = require('chai');
const expect = chai.expect;
const kmsDecrypt = require('../lib/utils/kmsDecrypt');
const SHOPIFY_SECRET = 'AQECAHioVPE+YJ4b5SohCuIr6R7VR/be4EWPMaagqncHkd8O3AAAAHQwcgYJKoZIhvcNAQcGoGUwYwIBADBeBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDMhl9dRGpy2IMQyaiAIBEIAxO1iZ9uabbGAEQBwompidRvcVbQow9rOQgbLiIlfIPaLilSZpmErajcklYG4Q1PZfRQ==';
let context = {};
context.awsRequestId = 'tempAwsRequestId';

describe('Test KMS Decrypt', function() {
    it('Check KMS decrypt with valid secret', function() {
        process.env.ShopifySecret = SHOPIFY_SECRET;
        let encryptedKeys = {};
        encryptedKeys['SHOPIFY_SECRET'] = process.env.ShopifySecret;
        return kmsDecrypt(encryptedKeys, context)
            .then(function(data) {
                expect(data['SHOPIFY_SECRET']).to.equal('SHOPIFY_WEBHOOK_SECRET');
            });
    });
    it('Check KMS decrypt with invalid secret', function() {
        process.env.ShopifySecret = 'Invalid_SHOPIFY_SECRET';
        let encryptedKeys = {};
        encryptedKeys['SHOPIFY_SECRET'] = process.env.ShopifySecret;
        return kmsDecrypt(encryptedKeys, context)
            .then(function(data) {
                expect(data['SHOPIFY_SECRET']).to.equal('fail');
            }).catch(function(err) {
                expect(err.code).to.equal('InvalidCiphertextException');
            });
    });
    afterEach(function() {
        delete process.env.ShopifySecret;
    });
});
//npm test test/testKmsDecrypt