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
        lasthash: netStat.hash,
        hashRate: util.shortenLargeNumber(parseInt((netStat.difficulty) / 240), 3) + 'H/s'
       });

    }).catch((error) => {
      this.emit('error', 'updateStatistics() -> getting network metrics');
    });
  };
}

module.exports = Network;