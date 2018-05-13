'use strict';
const jquery = require('jquery');
const toast = require('./toast');

const DONATE_WALLET = 'WmtjC5ZDa4wX9CBEZxcTa9fh7d8CAFeP82jS1W9hCxWb2gRNMztXnH3f67uVRbqBUxWPFxXqBcdi3EEAjMYtHrCt2erpgT6oP';

window.copyDonateAddress = function copyDonateAddress()  {
  const el = document.createElement('textarea');            
  
  el.value = DONATE_WALLET;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  $.toast("Thank's for considering a donating!", 'info', 2250);
}
