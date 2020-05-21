'use strict';

const imports = require('./imports');
const logger = imports.log4js.getLogger('getShopifyCancelledOrderIds');
logger.setLevel(imports.loggerLevel);

const getShopifyCancelledOrderIds = function(shopifyOrders, shopifyScheduleDates, context) {
    return new imports.Bluebird((resolve, reject) => {
        let shopifyOrderIds = [];
        try {
            let startDate = imports.moment(shopifyScheduleDates['scheduleFromDate']).format(imports.dateTimeFormatT);
            let endDate = imports.moment(shopifyScheduleDates['scheduleToDate']).format(imports.dateTimeFormatT);
            for (let i = 0; i < shopifyOrders.length; i++) {
                for (let j = 0; j < shopifyOrders[i].orders.length; j++) {
                    if (shopifyOrders[i].orders[j].cancelled_at !== null) {
                        let cancelledAt = imports.moment(shopifyOrders[i].orders[j].cancelled_at).format(imports.dateTimeFormatT);
                        if (imports.moment(cancelledAt).isBetween(startDate, endDate)) {
                            shopifyOrderIds.push(shopifyOrders[i].orders[j].id);
                        }
                    }
                }
            }
            resolve(shopifyOrderIds);
        } catch (exception) {
            logger.error(`  ${context.awsRequestId}  getShopifyCancelledOrderIds exception: ${exception}`);
            reject(exception);
        }
    });
};
module.exports = getShopifyCancelledOrderIds;