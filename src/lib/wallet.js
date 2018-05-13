
const EventEmitter = require('events');
const axios = require('axios');
const moment = require('moment');
const util = require('./utils');
const toast = require('./toast');

let w;

const Wallet = class extends EventEmitter {
  constructor(wallet, apiUrl) {
    super();
    this.updateIntervall = 5000;
    this.init(wallet, apiUrl);
    setInterval(() => { this.updateStatistics();}, this.updateIntervall);
  }

  init(wallet, apiUrl) {
    this.wallet = wallet;
    this.apiUrl = apiUrl;
    this.updateStatistics();
  }

  async updateStatistics() {
    if(!this.isWalletAndApiPresent()) {
      this.emit('no wallet');
      return;
    }
    
    let URL = this.apiUrl + 'miner/' + this.wallet + '/stats';
    axios.get(URL).then((response) => {
      if(response.data === undefined || response.data.length === 0)
        this.emit('no wallet');
      
      const walletStat = response.data;
      this.emit('wallet', {
        hashrate: util.shortenLargeNumber(walletStat.hash, 2) + " H/s",
        due: (walletStat.amtDue / 1000000000000).toFixed(3) + " AEON",
        paid: (walletStat.amtPaid / 1000000000000).toFixed(3) + " AEON"
      })
    }).catch((e) => {
      console.log(e);
      this.emit('no wallet');
    });

    
    URL = this.apiUrl + 'miner/' + this.wallet + '/payments';
    axios.get(URL)
    .then((response) => {
      if(response.data === undefined || response.data.length === 0) {
        this.emit('wallet', {lastpay: 'Never'});
        return;
      }

      const walletStat = response.data;
      var paymentTime = new Date(walletStat[0].ts * 1000);
      const timeSinceLastPayment = moment(paymentTime || 'never').fromNow();

      this.emit('wallet', {lastpay: timeSinceLastPayment});
    }).catch((e) => {
      console.log(e);
      this.emit('no wallet');
    });
  };

  getWalletPayments() {
    if(!this.isWalletAndApiPresent()) {
      return;
    }
    const URL = this.apiUrl + 'miner/' + this.wallet + '/payments';
    axios.get(URL)
    .then((response) => {
      const wp = response.data;
      const titles = {
        dialogTitle: 'Wallet payments',
        col1Title: 'When',
        col2Title: 'Amount',
        col3Title: 'TX Hash',
      };
      var rows = new Array();

      wp.forEach((e) => {
        var pTime = new Date(e.ts * 1000);
        const sTime = moment(pTime).fromNow();
        rows.push({col1: sTime, col2: (e.amount / 1e12).toFixed(2), col3:  e.txnHash});
      });
      this.emit('wallet payments', {titles: titles, paymentrows: rows});
    })
    .catch((e) => {
      $.toast('Can\'t get list of wallet payments, please try again later', 'danger', 2100);
    });
  }

  isWalletAndApiPresent() {
    return !(this.wallet === undefined || this.wallet.length === 0 || this.apiUrl === undefined ||this.apiUrl.length === 0);
  }
}

module.exports = Wallet;