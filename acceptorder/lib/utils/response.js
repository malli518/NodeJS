'use strict';

const prepareResponse = function(statusCode, message, event) {
    let response = {};
    response['statusCode'] = statusCode;
    return response;
};
module.exports = { prepareResponse: prepareResponse };