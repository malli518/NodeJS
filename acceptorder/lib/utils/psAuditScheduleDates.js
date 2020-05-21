'use strict';

const imports = require('./imports');
const dynamoQuery = require('./dynamoQuery');
const logger = imports.log4js.getLogger('psAuditScheduleDates');
logger.setLevel(imports.loggerLevel);

const psAuditScheduleDates = function(params, context) {
    return new imports.Bluebird((resolve, reject) => {
        try {
            let auditScheduleDates = {};
            let lastRunDateFromDB;
            dynamoQuery(params, context)
                .then(scheduleDates => {
                    try {
                        let currentDate = imports.moment().format(imports.dateTimeFormatT);
                        let yesterdayDate = imports.moment().add(-1, 'days').format(imports.dateTimeFormatT);
                        if (!imports.underscore.isEmpty(scheduleDates.Items)) {
                            lastRunDateFromDB = scheduleDates.Items[0].LastRunDate;
                        } else {
                            lastRunDateFromDB = yesterdayDate;
                        }
                        let scheduleFromDate = imports.moment(lastRunDateFromDB).startOf('day').format(imports.dateTimeFormatT);
                        let scheduleToDate = imports.moment(yesterdayDate).endOf('day').format(imports.dateTimeFormatT);
                        auditScheduleDates['scheduleFromDate'] = scheduleFromDate;
                        auditScheduleDates['scheduleToDate'] = scheduleToDate;
                        auditScheduleDates['lastRunDate'] = currentDate;
                        resolve(auditScheduleDates);
                    } catch (exception) {
                        logger.error(`  ${context.awsRequestId}  psAuditScheduleDates exception: ${exception}`);
                        reject(exception);
                    }
                }).catch(function(err) {
                    logger.error(`  ${context.awsRequestId}  psAuditScheduleDates error: ${err}`);
                    reject(err);
                });
        } catch (exception) {
            logger.error(`  ${context.awsRequestId}  psAuditScheduleDates exception: ${exception}`);
            reject(exception);
        }
    });
};
module.exports = psAuditScheduleDates;