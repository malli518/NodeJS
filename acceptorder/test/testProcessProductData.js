'use strict';

const chai = require('chai');
const expect = chai.expect;
const processProductData = require('../lib/services/processProductData');
let context = {};
context.awsRequestId = 'tempAwsRequestId';
describe('Test processProductData -', function() {
    // it('put the processProductData into DB  with success state', function() {
    //     let productInfo = { Id: '123456789', ShardId: 'shardId-000000000000:49569579067845859367373384393441534209097912925454073858', Title: 'test', BodyHtml: 'Scorecards, Wien Opener, and Cocktail Napkins.', Vendor: 'WineStoreDev', collection_dtl_party_tip_video_url: 'https://www.dropbox.com/s/db21hw2adrzm0h4/Colin%20Cowie%20and%20The%20Perfect%20Sip.mp4?dl=1' };
    //     process.env.ProductsTableName = 'psProductsInfoTable';
    //     return processProductData(productInfo, context)
    //         .then(function(data) {
    //             expect(data).to.exist;
    //         });
    // });
    it('put the ProductData into DB  with invalidtablename', function() {
        let productInfo = { Id: '123456789', ShardId: 'shardId-000000000000:49569579067845859367373384393441534209097912925454073858', Title: 'test', BodyHtml: 'Scorecards, Wien Opener, and Cocktail Napkins.', Vendor: 'WineStoreDev', collection_dtl_party_tip_video_url: 'https://www.dropbox.com/s/db21hw2adrzm0h4/Colin%20Cowie%20and%20The%20Perfect%20Sip.mp4?dl=1' };
        process.env.ProductsTableName = 'invalidtablename';
        return processProductData(productInfo, context)
            .then(function(data) {
                expect(data).to.not.exist;
            }).catch(function(err) {
                // console.log(err);
                expect(err.code).to.equal('ResourceNotFoundException');
            });
    });
    it('put the ProductData into DB  with empty productInfo object', function() {
        let productInfo = {};
        process.env.ProductsTableName = 'psProductsInfoTable';
        return processProductData(productInfo, context)
            .then(function(data) {
                expect(data).to.not.exist;
            }).catch(function(err) {
                expect(err.code).to.equal('ValidationException');
            });
    });
});
//npm test test/testProcessProductData