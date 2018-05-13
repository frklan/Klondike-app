'use strict';
const jquery = require('jquery');
const util = require('./utils');
const toast = require('./toast');
const Network = require('./network');
const Pool = require('./pool');
const Wallet = require('./wallet');

const App = class {
  constructor() { 
    
    this.createNetwork();
    this.createPool();
    this.createWallet();

    this.checkIfWalletExist();
    this.checkIfApiExist();
  };

  checkIfWalletExist() {
    this.getLocalStorageItem('wallet', true, 'Please use \'Track wallet\' in the menu to add wallet data', 'info');
  }

  checkIfApiExist() {
    let localStorage = window.localStorage;
    let api = JSON.parse(localStorage.getItem('pool api'));
    
    if(api === undefined || api === null) {
      $.toast('Missing pool api, please select in the menu', 'danger', 2750);
      return;
    }

    this.getLocalStorageItem('pool api', true, 'Missing pool api, please select in the menu', 'danger');
  }

  storeSettingsToDb(s) {
    let localStorage = window.localStorage;

    if(s.wallet != undefined) {
      localStorage.setItem('wallet', JSON.stringify(s.wallet));
      this.createWallet();
    }
    
    if(s.poolApi && s.poolName) {
      localStorage.setItem('pool api', JSON.stringify(s.poolApi));
      localStorage.setItem('pool name', JSON.stringify(s.poolName));
      this.createNetwork();
      this.createPool();
      this.createWallet();
    }
  }

  getLocalStorageItem(key, warnIfMissing, promt, promptType = 'info' ) {
    let localStorage = window.localStorage;
    let i = JSON.parse(localStorage.getItem(key));

    if(prompt && (i === undefined || i === null || i.length === 0)) {
      $.toast(promt, promptType, 3500);
      return;
    }
    return i;
  }

  displayPoolBlocks() {
    this.pool.getPoolBlocks();
  }

  displayWalletPayments() {
    this.wallet.getWalletPayments();
  }

  /* Callbacks.. */
  networkError(e) {
    console.log('network error (' + e + '), hiding stat panels.');
    $(".network-panel").hide();
    $(".pool-panel").hide();
    $(".wallet-panel").hide();
  }

  createNetwork() {
    let localStorage = window.localStorage;
    let api = JSON.parse(localStorage.getItem('pool api'));
    
    if(api === undefined || api === null) {
      $(".network-panel").hide();
      return;
    }

    if(!this.network) 
      this.network = new Network(api);
    else
      this.network.init(api)

    this.network.on('net', (s) => {
      if(s.hashRate)
        $("#netHashRate").text(s.hashRate);
      if(s.diff)
        $("#netDifficulty").text(s.diff);
      if(s.height)
        $("#netBlockHeight").text(s.height);
      if(s.time)
        $("#netLastBlockFoundTime").text(s.time);
      if(s.reward)
        $("#netBlockReward").text(s.reward + ' Aeon');
      if(s.lasthash)
        $("#netlastBlockFound").text(s.lasthash);

      $(".network-panel").show();
    });

    this.network.on('no network', () => {
      $(".network-panel").hide();
    });

    this.network.on('error', () => {
      this.networkError();
    });
  }

  createPool() {
    let localStorage = window.localStorage;
    let api = JSON.parse(localStorage.getItem('pool api'));
    let name = JSON.parse(localStorage.getItem('pool name'));

    if(api === undefined || api === null || name === undefined || name === null) {
      $(".pool-panel").hide();
      return;
    }

    if(!this.pool)
      this.pool = new Pool(api, name);
    else
      this.pool.init(api, name);

    this.pool.on('pool', (s) => {
      if(s.hashrate)
        $("#poolHashRate").text(s.hashrate);
      if(s.timeLastBlock)
        $("#poolLastBlockFoundTime").text(s.timeLastBlock);
      if(s.lastBlock)
        $("#poolLastBlockFound").html(s.lastBlock);
      
        
      $("#pool-address").text(name);
      $(".pool-panel").show();
    });

    this.pool.on('pool blocks', (p) => {
      util.showListBox(p.titles, p.blockrows);
    });

    this.pool.on('no pool', () => {
      $(".pool-panel").hide();
    });

    this.pool.on('error', () => {
      this.networkError();
    });
  }

  createWallet() {
    let localStorage = window.localStorage;
    let w = JSON.parse(localStorage.getItem('wallet'));
    let api = JSON.parse(localStorage.getItem('pool api'));

    if(w === undefined || w === null || api === undefined || api === null) {
      $(".wallet-panel").hide();
      return;
    }
    
    if(!this.wallet)
      this.wallet = new Wallet(w, api);
    else
      this.wallet.init(w, api);

    this.wallet.on('wallet', (s) => {
      if(s.hashrate)
        $("#walletHash").text(s.hashrate);
      if(s.due)
        $("#walletDue").text(s.due);
      if(s.paid)
        $("#walletTotalPaid").text(s.paid);
      if(s.lastpay)
        $("#walletLastPay").text(s.lastpay);

      $("#wallet-address").text(w);  
      $(".wallet-panel").show();
    });

    this.wallet.on('wallet payments', (p) => {
      util.showListBox(p.titles, p.paymentrows);
    });

    this.wallet.on('no wallet', () => {
      $(".wallet-panel").hide();
    });

  }

  
};

module.exports = App;