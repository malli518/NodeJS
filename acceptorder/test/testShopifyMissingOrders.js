'use strict';

const chai = require('chai');
const expect = chai.expect;
const shopifyMissingOrders = require('../lib/services/shopifyMissingOrders');
let context = {};
context.awsRequestId = 'tempAwsRequestId';
let event = {};
event['scheduleOrderName'] = 'CreateOrder';
event['status'] = 'any';
event['shopifyCancelledFlag'] = 0;
let invalidevent = {};
describe('Test shopifyMissingOrders - ', function() {
    it('get the shopifyMissingOrders with valid event', function() {
        process.env.ShopifyApiKey = 'AQECAHioVPE+YJ4b5SohCuIr6R7VR/be4EWPMaagqncHkd8O3AAAAH4wfAYJKoZIhvcNAQcGoG8wbQIBADBoBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDHHsUbvkx4GqxAvHzAIBEIA7nEqACifVAIECSocjDQe3Z3OmHJkAMjhQvg5gjJbFyxV5VMvd3dFGGrJNxG6UCqVErPNxwXPiYD3Tmls=';
        process.env.ShopifyAccessToken = 'AQECAHioVPE+YJ4b5SohCuIr6R7VR/be4EWPMaagqncHkd8O3AAAAH4wfAYJKoZIhvcNAQcGoG8wbQIBADBoBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDPAijpfbxDpaM01SdwIBEIA7/mu6oA+d0uUwTDux8aaMQCHcotdYE7kQC7nEWTl1Tr/2zzltt2qzLQgSBj7a6bcDIysZz4uDw7g4V20=';
        process.env.AuditSchedulerTableName = 'psAuditSchedulerTable';
        process.env.psShop = 'winestoredev.myshopify.com';
        process.env.RateLimitDelay = 20000;
        process.env.BackOff = 70;
        process.env.BackOffDelay = 5000;
        process.env.OrdersTableName = 'psAuditOrdersTable';
        process.env.OrdersTableShopifyCreatedDateIndex = 'ShopifyCreatedDate-index';
        return shopifyMissingOrders(event, context)
            .then(function(data) {
                expect(data).to.exist;
            });
    });
    it('get the shopifyMissingOrders with invalid event', function() {
        process.env.ShopifyApiKey = 'AQECAHioVPE+YJ4b5SohCuIr6R7VR/be4EWPMaagqncHkd8O3AAAAH4wfAYJKoZIhvcNAQcGoG8wbQIBADBoBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDHHsUbvkx4GqxAvHzAIBEIA7nEqACifVAIECSocjDQe3Z3OmHJkAMjhQvg5gjJbFyxV5VMvd3dFGGrJNxG6UCqVErPNxwXPiYD3Tmls=';
        process.env.ShopifyAccessToken = 'AQECAHioVPE+YJ4b5SohCuIr6R7VR/be4EWPMaagqncHkd8O3AAAAH4wfAYJKoZIhvcNAQcGoG8wbQIBADBoBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDPAijpfbxDpaM01SdwIBEIA7/mu6oA+d0uUwTDux8aaMQCHcotdYE7kQC7nEWTl1Tr/2zzltt2qzLQgSBj7a6bcDIysZz4uDw7g4V20=';
        process.env.AuditSchedulerTableName = 'psAuditSchedulerTable';
        process.env.psShop = 'winestoredev.myshopify.com';
        process.env.RateLimitDelay = 20000;
        process.env.BackOff = 70;
        process.env.BackOffDelay = 5000;
        process.env.OrdersTableName = 'psAuditOrdersTable';
        process.env.OrdersTableShopifyCreatedDateIndex = 'ShopifyCreatedDate-index';
        return shopifyMissingOrders(invalidevent, context)
            .then(function(data) {
                expect(data).to.not.exist;
            }).catch(function(err) {
                expect(err.code).to.equal('ValidationException');
            });
    });
    it('get the shopifyMissingOrders with invalid_shopify_api_keyss and ShopifyAccessToken', function() {
        process.env.ShopifyApiKey = 'invalid_shopify_api_keyss';
        process.env.ShopifyAccessToken = 'invalid_shopify_access_token';
        process.env.AuditSchedulerTableName = 'psAuditSchedulerTable';
        process.env.psShop = 'winestoredev.myshopify.com';
        process.env.RateLimitDelay = 20000;
        process.env.BackOff = 70;
        process.env.BackOffDelay = 5000;
        process.env.OrdersTableName = 'psAuditOrdersTable';
        process.env.OrdersTableShopifyCreatedDateIndex = 'ShopifyCreatedDate-index';
        return shopifyMissingOrders(event, context)
            .then(function(data) {
                expect(data).to.not.exist;
            }).catch(function(err) {
                //console.log(err);
                expect(err.code).to.equal('InvalidCiphertextException');
            });
    });
    it('get the shopifyMissingOrders with invalid  encrypted keys', function() {
        process.env.ShopifyApiKey = 'AQECAHioVPE+YJ4b5SohCuIr6R7VR/be4EWPMaagqncHkd8O3AAAAGkwZwYJKoZIhvcNAQcGoFowWAIBADBTBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDNKsUEnHw40ZuTbotgIBEIAm7WD7fG9jyNotMbh/sS92jSBA8jje2PzE+dzTx8Z7uw+p7AdFBBg=';
        process.env.ShopifyAccessToken = 'AQECAHioVPE+YJ4b5SohCuIr6R7VR/be4EWPMaagqncHkd8O3AAAAGcwZQYJKoZIhvcNAQcGoFgwVgIBADBRBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDF/iv8zjCSkBxOgebQIBEIAkW3u/N6wg/tCWxRfuG3gLuiObR5dfi5rpRAnMq+uLGpVoNf1l';
        process.env.AuditSchedulerTableName = 'psAuditSchedulerTable';
        process.env.psShop = 'winestoredev.myshopify.com';
        process.env.RateLimitDelay = 20000;
        process.env.BackOff = 70;
        process.env.BackOffDelay = 5000;
        process.env.OrdersTableName = 'psAuditOrdersTable';
        process.env.OrdersTableShopifyCreatedDateIndex = 'ShopifyCreatedDate-index';
        return shopifyMissingOrders(event, context)
            .then(function(data) {
                expect(data).to.not.exist;
            }).catch(function(err) {
                // console.log(err);
                expect(err.code).to.equal(401);
            });
    });
    it('get the shopifyMissingOrders with invalid  psShop name', function() {
        process.env.ShopifyApiKey = 'AQECAHioVPE+YJ4b5SohCuIr6R7VR/be4EWPMaagqncHkd8O3AAAAH4wfAYJKoZIhvcNAQcGoG8wbQIBADBoBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDHHsUbvkx4GqxAvHzAIBEIA7nEqACifVAIECSocjDQe3Z3OmHJkAMjhQvg5gjJbFyxV5VMvd3dFGGrJNxG6UCqVErPNxwXPiYD3Tmls=';
        process.env.ShopifyAccessToken = 'AQECAHioVPE+YJ4b5SohCuIr6R7VR/be4EWPMaagqncHkd8O3AAAAH4wfAYJKoZIhvcNAQcGoG8wbQIBADBoBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDPAijpfbxDpaM01SdwIBEIA7/mu6oA+d0uUwTDux8aaMQCHcotdYE7kQC7nEWTl1Tr/2zzltt2qzLQgSBj7a6bcDIysZz4uDw7g4V20=';
        process.env.AuditSchedulerTableName = 'psAuditSchedulerTable';
        process.env.psShop = 'invalidpsShop';
        process.env.RateLimitDelay = 20000;
        process.env.BackOff = 70;
        process.env.BackOffDelay = 5000;
        process.env.OrdersTableName = 'psAuditOrdersTable';
        process.env.OrdersTableShopifyCreatedDateIndex = 'ShopifyCreatedDate-index';
        return shopifyMissingOrders(event, context)
            .then(function(data) {
                expect(data).to.not.exist;
            }).catch(function(err) {
                //console.log(err);
                expect(err.code).to.equal(404);
            });
    });
    it('get the shopifyMissingOrders with invalid  table  name', function() {
        process.env.ShopifyApiKey = 'AQECAHioVPE+YJ4b5SohCuIr6R7VR/be4EWPMaagqncHkd8O3AAAAH4wfAYJKoZIhvcNAQcGoG8wbQIBADBoBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDHHsUbvkx4GqxAvHzAIBEIA7nEqACifVAIECSocjDQe3Z3OmHJkAMjhQvg5gjJbFyxV5VMvd3dFGGrJNxG6UCqVErPNxwXPiYD3Tmls=';
        process.env.ShopifyAccessToken = 'AQECAHioVPE+YJ4b5SohCuIr6R7VR/be4EWPMaagqncHkd8O3AAAAH4wfAYJKoZIhvcNAQcGoG8wbQIBADBoBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDPAijpfbxDpaM01SdwIBEIA7/mu6oA+d0uUwTDux8aaMQCHcotdYE7kQC7nEWTl1Tr/2zzltt2qzLQgSBj7a6bcDIysZz4uDw7g4V20=';
        process.env.AuditSchedulerTableName = 'invalidtablename';
        process.env.psShop = 'winestoredev.myshopify.com';
        process.env.RateLimitDelay = 20000;
        process.env.BackOff = 70;
        process.env.BackOffDelay = 5000;
        process.env.OrdersTableName = 'psAuditOrdersTable';
        process.env.OrdersTableShopifyCreatedDateIndex = 'ShopifyCreatedDate-index';
        return shopifyMissingOrders(event, context)
            .then(function(data) {
                expect(data).to.not.exist;
            }).catch(function(err) {
                // console.log(err);
                expect(err.code).to.equal('ResourceNotFoundException');
            });
    });
});
//npm test test/testShopifyMissingOrders