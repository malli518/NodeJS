'use strict';

const chai = require('chai');
const expect = chai.expect;
const prepareProduct = require('../lib/utils/prepareProduct');
let context = {};
context.awsRequestId = 'tempAwsRequestId';
describe('Test prepareProduct -', function() {
    it('prepareProduct info with success state', function() {
        let eventId = 'shardId-000000000000:49569579067845859367373384393441534209097912925454073858';
        let productId = '7101566725';
        let payloadObj = { 'id': 7101566725, 'title': 'test', 'body_html': 'Scorecards, Wien Opener, and Cocktail Napkins.', 'vendor': 'WineStoreDev', 'product_type': 'Accoutrements', 'created_at': '2017-02-07T01:14:40-05:00', 'handle': 'test', 'updated_at': '2017-02-07T01:33:03-05:00', 'published_at': '2017-02-03T06:52:00-05:00', 'template_suffix': null, 'published_scope': 'global', 'tags': '', 'variants': [{ 'id': 25018579077, 'product_id': 7101566725, 'title': 'Default Title', 'price': '0.00', 'sku': '', 'position': 1, 'grams': 0, 'inventory_policy': 'deny', 'compare_at_price': null, 'fulfillment_service': 'manual', 'inventory_management': null, 'option1': 'Default Title', 'option2': null, 'option3': null, 'created_at': '2017-02-07T01:14:40-05:00', 'updated_at': '2017-02-07T01:14:40-05:00', 'taxable': true, 'barcode': '', 'image_id': null, 'inventory_quantity': 0, 'weight': 0, 'weight_unit': 'lb', 'old_inventory_quantity': 0, 'requires_shipping': true }], 'options': [{ 'id': 8595098565, 'product_id': 7101566725, 'name': 'Title', 'position': 1, 'values': ['Default Title'] }], 'images': [{ 'id': 18268558213, 'product_id': 7101566725, 'position': 1, 'created_at': '2017-02-07T01:14:40-05:00', 'updated_at': '2017-02-07T01:14:40-05:00', 'src': 'https://cdn.shopify.com/s/files/1/1499/0216/products/Accoutrement_8fe401af-739f-4164-9024-da7755d3ae95.jpg?v=1486448080', 'variant_ids': [] }], 'image': { 'id': 18268558213, 'product_id': 7101566725, 'position': 1, 'created_at': '2017-02-07T01:14:40-05:00', 'updated_at': '2017-02-07T01:14:40-05:00', 'src': 'https://cdn.shopify.com/s/files/1/1499/0216/products/Accoutrement_8fe401af-739f-4164-9024-da7755d3ae95.jpg?v=1486448080', 'variant_ids': [] } }
            //let productMetafields = { 'metafields': [] };
        let metafields = { 'metafields': [{ 'id': 7101566725, 'namespace': 'collection_dtl', 'key': 'party_tip_video_url', 'value': 'https:\/\/www.dropbox.com\/s\/db21hw2adrzm0h4\/Colin%20Cowie%20and%20The%20Perfect%20Sip.mp4?dl=1' }] };
        return prepareProduct(eventId, productId, payloadObj, metafields, context)
            .then(function(data) {
                // console.log(data);
                expect(data).to.exist;
            });
    });
    it('prepareProduct info with empty  metafields object', function() {
        let eventId = 'shardId-000000000000:49569579067845859367373384393441534209097912925454073858';
        let productId = '7101566725';
        let payloadObj = { 'id': 7101566725, 'title': 'test', 'body_html': 'Scorecards, Wien Opener, and Cocktail Napkins.', 'vendor': 'WineStoreDev' };
        let metafields = {};
        return prepareProduct(eventId, productId, payloadObj, metafields, context)
            .then(function(data) {
                expect(data).to.not.exist;
            }).catch(function(err) {
                console.log(err.message);
                expect(err.message).to.contain('Cannot read property');
            });
    });
    it('prepareProduct info with empty  payloadObject', function() {
        let eventId = 'shardId-000000000000:49569579067845859367373384393441534209097912925454073858';
        let productId = '7101566725';
        let payloadObj = {};
        let metafields = { 'metafields': [{ 'id': 7101566725, 'namespace': 'collection_dtl', 'key': 'party_tip_video_url', 'value': 'https:\/\/www.dropbox.com\/s\/db21hw2adrzm0h4\/Colin%20Cowie%20and%20The%20Perfect%20Sip.mp4?dl=1' }] };
        return prepareProduct(eventId, productId, payloadObj, metafields, context)
            .then(function(data) {
                expect(data).to.not.exist;
            }).catch(function(err) {
                console.log(err.message);
                expect(err.message).to.contain('expected { Object (Id, ShardId, ...) } to not exist');
            });
    });
});
//npm test test/testPrepareProduct