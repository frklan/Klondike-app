
const EventEmitter = require('events');
const axios = require('axios');
const moment = require('moment');
const util = require('./utils');
const toast = require('./toast');

const Pool = class extends EventEmitter {
  constructor(apiUrl, name) {
    super();
    this.updateIntervall = 5000;
    this.init(apiUrl, name);
    setInterval(() => { this.updateStatistics(); }, this.updateIntervall);
  }

  init(apiUrl, name) {
    this.apiUrl = apiUrl;
    this.updateStatistics();
  }

  async updateStatistics() {
    if(!this.isApiPresent()) {
      this.emit('no network');
      return;
    }

    // Get pool stats
    const URL = this.apiUrl + 'pool/stats';
    axios.get(URL).then((response) => {
      const poolStat = response.data.pool_statistics;
      const blockFoundTime = new Date(poolStat.lastBlockFoundTime*1000);
      const timeSinceLastBlock = moment(blockFoundTime).fromNow();

      this.emit('pool', {
        hashrate: util.shortenLargeNumber(poolStat.hashRate, 1) + 'H/s',
        timeLastBlock: timeSinceLastBlock,
        lastBlock: poolStat.lastBlockFound
      });
      
    
    }).catch((error) => {
      this.emit('error', 'updateStatistics() -> getting pool stats');
    });
  };


  getPoolBlocks() {
    if(!this.isApiPresent()) {
      return;
    }
    const URL = this.apiUrl + 'pool/blocks/PPLNS';

    axios.get(URL)
    .then((response) => {
      const pb = response.data;
      const titles = {
        dialogTitle: 'Pool blocks',
        col1Title: 'When',
        col2Title: 'Height',
        col3Title: 'Hash',
      };
      var rows = new Array();

      pb.forEach((b) => {
        var bTime = new Date(b.ts);
        const sTime = moment(bTime).fromNow();
        rows.push({col1: sTime, col2: b.height, col3:  b.hash});
      });
        this.emit('pool blocks', {titles: titles, blockrows: rows});
    })
    .catch((e) => {
      $.toast('Can\'t get list of pool blocks, please try again later', 'danger', 2100);
    });
  }

  isApiPresent() {
    return !(this.apiUrl === undefined || this.apiUrl.length === 0);
  }
}

module.exports = Pool;