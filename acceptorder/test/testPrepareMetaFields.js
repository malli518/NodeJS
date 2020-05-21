'use strict';

const chai = require('chai');
const expect = chai.expect;
const prepareMetaFields = require('../lib/utils/prepareMetaFields');
let context = {};
context.awsRequestId = 'tempAwsRequestId';
describe('Test prepareMetaFields -', function() {
    it('prepareMetaFields with success state', function() {
        let items = { Id: '7101566725', ShardId: 'shardId-000000000000:49569579067845859367373384393441534209097912925454073858', Title: 'test', BodyHtml: 'Scorecards, Wien Opener, and Cocktail Napkins.', Vendor: 'WineStoreDev' };
        let metafields = { 'metafields': [{ 'id': 7101566725, 'namespace': 'collection_dtl', 'key': 'party_tip_video_url', 'value': 'https:\/\/www.dropbox.com\/s\/db21hw2adrzm0h4\/Colin%20Cowie%20and%20The%20Perfect%20Sip.mp4?dl=1' }] };
        return prepareMetaFields(items, metafields, context)
            .then(function(data) {
                //console.log(data);
                expect(data).to.exist;
            });
    });
    it('prepareMetaFields with empty  metafields object', function() {
        let items = { Id: '7101566725', ShardId: 'shardId-000000000000:49569579067845859367373384393441534209097912925454073858', Title: 'test', BodyHtml: 'Scorecards, Wien Opener, and Cocktail Napkins.', Vendor: 'WineStoreDev' };
        let metafields = {};
        return prepareMetaFields(items, metafields, context)
            .then(function(data) {
                expect(data).to.not.exist;
            }).catch(function(err) {
                console.log(err.message);
                expect(err.message).to.contain('Cannot read property');
            });
    });
    it('prepareMetaFields with empty  metafields object', function() {
        let items = {};
        let metafields = { 'metafields': [{ 'id': 7101566725, 'namespace': 'collection_dtl', 'key': 'party_tip_video_url', 'value': 'https:\/\/www.dropbox.com\/s\/db21hw2adrzm0h4\/Colin%20Cowie%20and%20The%20Perfect%20Sip.mp4?dl=1' }] };
        return prepareMetaFields(items, metafields, context)
            .then(function(data) {
                expect(data).to.not.exist;
            }).catch(function(err) {
                console.log(err.message);
                expect(err.message).to.contain('expected { Object (collection_dtl_party_tip_video_url) } to not exist');
            });
    });
});
//npm test test/testPrepareMetaFields