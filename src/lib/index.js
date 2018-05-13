'use strict';
const jquery = require('jquery');
const App = require('./app');
const toast = require('./toast');
const util = require('./utils');

let app;
$(document).ready(() => { 
  autoHideMenu();
  autoClearListBoxes();

  app = new App();

  $('#wallet-address').click(function(){
     $.toast('toast!!', 'info', 1500);
   });

 });

function autoHideMenu() {
  $(window).click(function(){
    $('.collapse').collapse('hide')
  });

  $('.dropdown-item').click(() => {
    $('.collapse').collapse('hide');    
  });
}

function autoClearListBoxes() {
  // Clear listbox items
  $('#listBoxModal').on('hidden.bs.modal', (e) => {
    $("#listboxItemList").empty();
  })
}

window.onGetWalletPayments = function onGetWalletPayments() {
  app.displayWalletPayments();
}

window.onGetPoolBlocks = function onGetPoolBlocks() {
  app.displayPoolBlocks();
}

window.onWalletSelect = function onWalletSelect() {
  const newWallet = $("#inputWalletToTrack").val();
  console.log(newWallet);
  if(newWallet.length > 0) {
    try {
      util.validateAddress(newWallet);
    } catch(e){
      $.toast('Invalid address, please try again', 'danger', 2100);
      return;
    }
  }
  $('#trackWalletInputModal').modal('toggle');
  app.storeSettingsToDb({wallet: newWallet });
}

window.onPoolApiSelect = function onPoolApiSelect(s) {
  let url = s.data('url');
  let name = s.data('name');
  if(url.length <= 0 || name.lenght <= 0) {
    $.toast('Invalid pool', 'warning', 2500);
    return;
  }
  app.storeSettingsToDb({poolApi: url, poolName: name});
}
  // // Set default values in wallet dialog
  // $('#trackWalletInputModal').on('shown.bs.modal', (e) => {
  //   try{
  //       util.validateAddress(walletAddress);
  //       $('#inputWalletToTrack').val(walletAddress);
  //   } catch(e) {}
  // });
  