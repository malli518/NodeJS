'use strict';

const imports = require('./lib/utils/imports');
const responseCodes = require("./lib/utils/responseCodes");
const prepareResponse = require("./lib/utils/response").prepareResponse;
const kmsDecrypt = require("./lib/utils/kmsDecrypt");
const verifyShopifyAPIHMAC = require("./lib/utils/verifyShopifyWebhook").verifyShopifyAPIHMAC;
const logger = imports.log4js.getLogger("fetchStock");
logger.setLevel(imports.loggerLevel);

module.exports.fetchStock = (event, context, callback) => {
    console.log(`event: ${JSON.stringify(event)}`);
    console.log(`context ${JSON.stringify(context)}`);
    const psShopStock = {
        "100019": 0,
        "10001111": 1,
        "9999999": 20,
        "88888888": 11
    };
    //const url_parts = url.parse()
    const psShop = "winestoredev.myshopify.com";//process.env.psShop;
    let inventoryLevel = {};
    let response;
    try {
        const eventShop = event.queryStringParameters.shop;
        const sku = event.queryStringParameters.sku;


        if (psShop === eventShop && sku === undefined) {
                            console.log("inside store match");
                            //Request for Inventory Level for all SKUs
                            inventoryLevel = psShopStock;
                            response = {
                                statusCode: responseCodes.SUCCESS,
                                body: JSON.stringify(inventoryLevel)
                            };
                            logger.info(`response:  ${JSON.stringify(response)}`);
                            return callback(null, response);
                        } else if (psShop === eventShop && sku !== undefined) {
                            console.log("not undefined");
                            console.log(`sku  inside ${sku}`);
                            //Request for Inventory Level for Single Sku
                            Object.keys(psShopStock)
                                .forEach(stockItem => {
                                    if (JSON.stringify(stockItem) === JSON.stringify(sku)) {
                                        inventoryLevel = {
                                            [stockItem]: psShopStock[stockItem]
                                        };
                                    }
                                });
                                response = {
                                statusCode: responseCodes.SUCCESS,
                                body: JSON.stringify(inventoryLevel)
                                };
                            logger.info(`response:  ${JSON.stringify(response)}`);
                            return callback(null, response);                            
                        }
    }catch (exception) {
        logger.error(`  ${context.awsRequestId}  postOrder  exception: ${exception}`);
        response = prepareResponse(responseCodes.INTERNALERROR, 'Decryption Error', event);
        return callback(null, response);
    }
};

        /*let encryptedKeys = {};
        encryptedKeys['SHOPIFY_SECRET'] = process.env.ShopifySecret;
        //call kmsDecrypt for SHOPIFY_SECRET
        kmsDecrypt(encryptedKeys, context)
            .then(function(decryptedKeys) {
                logger.info(`  ${context.awsRequestId}  Successfully decrypted Shopify Secret`);
                 if (psShop === eventShop && sku === undefined) {
                            console.log("inside store match");
                            //Request for Inventory Level for all SKUs
                            inventoryLevel = psShopStock;
                            response = {
                                statusCode: responseCodes.SUCCESS,
                                body: JSON.stringify(inventoryLevel)
                            };
                            logger.info(`response:  ${JSON.stringify(response)}`);
                        } else if (psShop === eventShop && sku !== undefined) {
                            console.log("not undefined");
                            console.log(`sku  inside ${sku}`);
                            //Request for Inventory Level for Single Sku
                            Object.keys(psShopStock)
                                .forEach(stockItem => {
                                    if (JSON.stringify(stockItem) === JSON.stringify(sku)) {
                                        inventoryLevel = {
                                            [stockItem]: psShopStock[stockItem]
                                        };
                                    }
                                });
                                response = {
                                statusCode: responseCodes.SUCCESS,
                                body: JSON.stringify(inventoryLevel)
                            };
                            logger.info(`response:  ${JSON.stringify(response)}`);
                            
                        }
                //call verifyShopifyWebhook
               /* verifyShopifyAPIHMAC(decryptedKeys['SHOPIFY_SECRET'], event, context)
                    .then(function(success) {
                        logger.info(`  ${context.awsRequestId}  shopify verification success.`);
                        //inventory level
                        if (psShop === eventShop && sku === undefined) {
                            console.log("inside store match");
                            //Request for Inventory Level for all SKUs
                            inventoryLevel = psShopStock;
                        } else if (shop === store && sku !== undefined) {
                            console.log("not undefined");
                            console.log(`sku  inside ${sku}`);
                            //Request for Inventory Level for Single Sku
                            Object.keys(psShopStock)
                                .forEach(stockItem => {
                                    if (JSON.stringify(stockItem) === JSON.stringify(sku)) {
                                        inventoryLevel = {
                                            [stockItem]: psShopStock[stockItem]
                                        };
                                    }
                                });
                            response = {
                                statusCode: responseCodes.SUCCESS,
                                body: JSON.stringify(inventoryLevel)
                            };
                            logger.info(`response:  ${response}`);
                        }
            })
                    .catch(function(hmacVerfErr) {
                        logger.info(`  ${context.awsRequestId}  HMAC verification failed.`);
                        //prepare response object
                        response = prepareResponse(responseCodes.UNAUTHORISED, hmacVerfErr.message, event);
                        return callback(null, response);
                    });*/
                   

//             })
//             .catch(function(kmsErr) {
//                 logger.error(`  ${context.awsRequestId}  decrypt error: ${kmsErr}`);
//                 response = prepareResponse(responseCodes.INTERNALERROR, 'Decryption Error', event);
//                 return callback(null, response);
//             });
//     } catch (exception) {
//         logger.error(`  ${context.awsRequestId}  postOrder  exception: ${exception}`);
//         response = prepareResponse(responseCodes.INTERNALERROR, 'Decryption Error', event);
//         return callback(null, response);
//     } finally {
//         callback(null, response);
//     }
// };