'use strict';

const SUCCESS = 200;
const BADREQUEST = 400;
const UNAUTHORISED = 401;
const FORBIDDEN = 403;
const NOTFOUND = 404;
const UNPROCESSABLEENTITY = 422;
const INTERNALERROR = 500;
const BADGATEWAY = 502;
const GATEWAYTIMEOUT = 504;

module.exports = {
    SUCCESS: SUCCESS,
    BADREQUEST: BADREQUEST,
    UNAUTHORISED: UNAUTHORISED,
    FORBIDDEN: FORBIDDEN,
    NOTFOUND: NOTFOUND,
    UNPROCESSABLEENTITY: UNPROCESSABLEENTITY,
    INTERNALERROR: INTERNALERROR,
    BADGATEWAY: BADGATEWAY,
    GATEWAYTIMEOUT: GATEWAYTIMEOUT
};