var express = require('express');
var router = express.Router();
const axios = require("axios");

/**
 * Will cache response from chainradar for 10 seconds,
 * 
 */

let aeonNetworkStat = '';
let aeonLastUpdated = 0;

router.get('/getaeonnetstat', function(req, res, next) {
  let d = new Date();
  let currentTime = d.getTime();

  if(currentTime - aeonLastUpdated < 10000) {
    return res.json(aeonNetworkStat);
  }

  axios.get('https://chainradar.com/api/v1/aeon/status')
  .then(function (response) {
    aeonNetworkStat = response.data;
    aeonLastUpdated = d.getTime();

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    return res.json(aeonNetworkStat);
  })
  .catch(function (error) {
    res.end(503);
  });
});


module.exports = router;