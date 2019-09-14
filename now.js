var { serverless } = require('@chadfawcett/probot-serverless-now');
const appFn = require('./src/index');
module.exports = serverless(appFn);
