'use strict'
const EventEmitter = require('events');
const axios = require('axios');
const moment = require('moment');
const util = require('./utils');


const Network = class extends EventEmitter {
  constructor(apiUrl) {
    super();
    this.init(apiUrl);
    this.updateIntervall = 5000;

    setInterval(() => {
      this.updateStatistics()
    }, this.updateIntervall);
  }

  init(apiUrl) {
    this.apiUrl = apiUrl;
    this.updateStatistics();
  }

  async updateStatistics() {
    if(this.apiUrl === undefined || this.apiUrl.length === 0) {
      this.emit('no network');
      return;
    }

    // Get netowk hash rate
    //https://dev.yellowforytfour.com:3010/api/v1/getaeonnetstat
    axios.get('https://67ixn52xbf.execute-api.eu-central-1.amazonaws.com/latest/api/v1/getaeonnetstat').then((response) => {
      const hashRate = util.shortenLargeNumber(response.data.instantHashrate, 1);
      this.emit('net', {hashRate: hashRate + 'H/s'}); 
    }).catch((error) => {
      this.emit('net', {hashRate: 'Unkown'});
    });
    
    // Get network stats
    const URL = this.apiUrl + 'network/stats';
    axios.get(URL).then((response) => {
      const netStat = response.data;
      var blockFoundTime = new Date(netStat.ts * 1000);
      const timeSinceLastBlock = moment(blockFoundTime).fromNow();
    
      this.emit('net', {
        diff: netStat.difficulty,
        height: netStat.height, 
        time: timeSinceLastBlock,
        reward: (netStat.value / 1000000000000).toFixed(3),
        lasthash: netStat.hash
       });

    }).catch((error) => {
      this.emit('error', 'updateStatistics() -> getting network metrics');
    });
  };
}

module.exports = Network;