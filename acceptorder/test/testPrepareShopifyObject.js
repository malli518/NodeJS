'use strict';

const chai = require('chai');
const expect = chai.expect;
const prepareShopifyObject = require('../lib/utils/prepareShopifyObject');
let context = {};
context.awsRequestId = 'tempAwsRequestId';

describe('Test prepareShopifyObject -', function() {
    it('Preapre prepareShopifyObject with success state', function() {
        process.env.ShopifyApiKey = 'AQECAHioVPE+YJ4b5SohCuIr6R7VR/be4EWPMaagqncHkd8O3AAAAH4wfAYJKoZIhvcNAQcGoG8wbQIBADBoBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDHHsUbvkx4GqxAvHzAIBEIA7nEqACifVAIECSocjDQe3Z3OmHJkAMjhQvg5gjJbFyxV5VMvd3dFGGrJNxG6UCqVErPNxwXPiYD3Tmls=';
        process.env.ShopifyAccessToken = 'AQECAHioVPE+YJ4b5SohCuIr6R7VR/be4EWPMaagqncHkd8O3AAAAH4wfAYJKoZIhvcNAQcGoG8wbQIBADBoBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDPAijpfbxDpaM01SdwIBEIA7/mu6oA+d0uUwTDux8aaMQCHcotdYE7kQC7nEWTl1Tr/2zzltt2qzLQgSBj7a6bcDIysZz4uDw7g4V20=';
        process.env.psShop = 'winestoredev.myshopify.com';
        process.env.RateLimitDelay = 20000;
        process.env.BackOff = 70;
        process.env.BackOffDelay = 5000;
        return prepareShopifyObject(context)
            .then(function(data) {
                console.log(data);
                expect(data.config.shopify_api_key).to.equal('e39b85c9f83eb07dc7a6f600f0069648');
                expect(data.config.access_token).to.equal('f6f2c5249bb08c812a6d90c4c3d69b5a');
                expect(data.config.shop).to.equal('winestoredev.myshopify.com');
            });
    });
    it('Preapre prepareShopifyObject with with invalid ShopifyApiKey', function() {
        process.env.ShopifyApiKey = 'invalidApiKey';
        process.env.ShopifyAccessToken = 'AQECAHioVPE+YJ4b5SohCuIr6R7VR/be4EWPMaagqncHkd8O3AAAAH4wfAYJKoZIhvcNAQcGoG8wbQIBADBoBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDPAijpfbxDpaM01SdwIBEIA7/mu6oA+d0uUwTDux8aaMQCHcotdYE7kQC7nEWTl1Tr/2zzltt2qzLQgSBj7a6bcDIysZz4uDw7g4V20=';
        process.env.psShop = 'winestoredev.myshopify.com';
        process.env.RateLimitDelay = 20000;
        process.env.BackOff = 70;
        process.env.BackOffDelay = 5000;
        return prepareShopifyObject(context)
            .then(function(data) {
                console.log(data);
                //expect(data['SHOPIFY_SECRET']).to.equal('fail');
            }).catch(function(err) {
                expect(err.code).to.equal('InvalidCiphertextException');
            });
    });
    afterEach(function() {
        delete process.env.ShopifyApiKey;
        delete process.env.ShopifyAccessToken;
        delete process.env.psShop;
        delete process.env.RateLimitDelay;
        delete process.env.BackOff;
        delete process.env.BackOffDelay;
    });
});
//npm test test/testPrepareShopifyObject