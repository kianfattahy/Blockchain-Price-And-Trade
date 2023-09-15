require("dotenv").config({});
const Web3 = require('web3');

// loading env vars
const HTTP_URL = process.env.HTTP_URL;
const HTTP = new Web3(HTTP_URL);
module.exports = { HTTP }
