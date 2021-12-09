require("dotenv").config({});
const web3 = require('web3');

// loading env vars
const WSS = process.env.WSS;
const web3WSS = new web3(WSS);

module.exports = { web3WSS }