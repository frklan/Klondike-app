'use strict';
const jquery = require('jquery');

const Util = class {
  /**
   * Generate a string with a random color code
   */

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  shortenLargeNumber(num, digits) {
    var units = [' k', ' M', ' G', ' T', ' P', ' E', ' Z', ' Y'],
    decimal;
  
    if(num == null)
      return 0;
  
    for(var i=units.length-1; i>=0; i--) {
      decimal = Math.pow(1000, i+1);
  
      if(num <= -decimal || num >= decimal) {
        return +(num / decimal).toFixed(digits) + units[i];
      }
    }
    return num;
  }

  validateAddress(address) {
    const regEx = /\b[0-9A-Z]{97}\b/gi;
  
    if(address == null || (address.length > 0 && regEx.test(address) !== true))
      throw 'not a valid address';
    return address;
  }

  showListBox(title, rows) {
    $("#listboxItemList").empty();
    $("#modalTitle").text(title.dialogTitle);
    $("#listboxCol1Title").text(title.col1Title);
    $("#listboxCol2Title").text(title.col2Title);
    $("#listboxCol3Title").text(title.col3Title);
    
    rows.forEach((r) => {
      $("#listboxItemList").append('<div class="row align-items-start" id="list-box-item"><div class="col-4">' + r.col1 + '</div><div class="col-2">' + r.col2 + '</div><div class="col-6 text-truncate">' + r.col3 + '</div></div>');
      $('#listBoxModal').modal('handleUpdate')
    });
    $('#listBoxModal').modal('show');
  }
  
}

module.exports = new Util();