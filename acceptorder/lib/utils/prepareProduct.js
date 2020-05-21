'use strict';

const imports = require('./imports');
const prepareMetaFields = require('./prepareMetaFields');

const logger = imports.log4js.getLogger('prepareProduct');
logger.setLevel(imports.loggerLevel);

const prepareProduct = function(eventId, productId, productBasicInfo, productMetafields, context) {
    return new imports.Bluebird((resolve, reject) => {
        let items = {};
        try {
            items['Id'] = productId;
            items['ShardId'] = eventId;
            if (productBasicInfo.title)
                items['Title'] = productBasicInfo.title;
            if (productBasicInfo.body_html)
                items['BodyHtml'] = productBasicInfo.body_html;
            if (productBasicInfo.vendor)
                items['Vendor'] = productBasicInfo.vendor;
            if (productBasicInfo.product_type)
                items['ProductType'] = productBasicInfo.product_type;
            if (productBasicInfo.created_at)
                items['CreatedAt'] = productBasicInfo.created_at;
            if (productBasicInfo.handle)
                items['Handle'] = productBasicInfo.handle;
            if (productBasicInfo.updated_at)
                items['UpdatedAt'] = productBasicInfo.updated_at;
            if (productBasicInfo.published_at)
                items['PublishedAt'] = productBasicInfo.published_at;
            if (productBasicInfo.template_suffix)
                items['TemplateSuffix'] = productBasicInfo.template_suffix;
            if (productBasicInfo.published_scope)
                items['PublishedScope'] = productBasicInfo.published_scope;
            if (productBasicInfo.tags)
                items['Tags'] = productBasicInfo.tags;
            if (productBasicInfo.variants)
                items['Variants'] = JSON.stringify(productBasicInfo.variants);
            if (productBasicInfo.options)
                items['Options'] = JSON.stringify(productBasicInfo.options);
            if (productBasicInfo.images)
                items['Images'] = JSON.stringify(productBasicInfo.images);
            if (productBasicInfo.image)
                items['Image'] = productBasicInfo.image;
            prepareMetaFields(items, productMetafields, context).then(item => {
                resolve(item);
            }).catch(err => {
                logger.error(`  ${context.awsRequestId}  prepareProduct err: ${err}`);
                reject(err);
            });
        } catch (exception) {
            logger.error(`  ${context.awsRequestId}  prepareProduct exception: ${exception}`);
            reject(exception);
        }
    });
};
module.exports = prepareProduct;