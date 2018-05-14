var express = require('express');
var router = express.Router();
const axios = require("axios");

function sendAccessControlHeader(res) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'application/json');
}

/**
 * Will cache response from chainradar for 10 seconds,
 * 
 */
let aeonNetworkStat = '';
let aeonLastUpdated = 0;

router.get('/getaeonnetstat', function(req, res, next) {
  let d = new Date();
  let currentTime = d.getTime();

  sendAccessControlHeader(res);

  if(currentTime - aeonLastUpdated < 10000 && aeonNetworkStat !== '') {
    return res.json(JSON.stringify(aeonNetworkStat));
  }

  axios.get('https://chainradar.com/api/v1/aeon/status')
  .then(function (response) {
    aeonNetworkStat = response.data;
    aeonLastUpdated = d.getTime();

    return res.json(JSON.stringify(aeonNetworkStat));
  })
  .catch(function (error) {
    res.end(503);
  });
});

module.exports = router;