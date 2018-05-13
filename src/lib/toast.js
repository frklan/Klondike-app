const jquery = require('jquery');

var Toast = {
  show: function(message, type, closeDelay) {
    type = type || "info";    

      let toastContainer = $('#status');  

      if(toastContainer.length === 0) {
        toastContainer = document.createElement('div');  
        toastContainer.setAttribute('class', 'align-right alert-box');
        toastContainer.setAttribute('id', 'status');
        document.body.appendChild(toastContainer);
      }

    // create the alert
    var alert = $('<div class="alert alert-fixed alert-' + type + ' collapse">')
      .append(
          $('<button type="button" class="close " data-dismiss="alert">')
          .append("&times;")
      )
      .append(message);

    // add the alert div to top of alerts-container,
    $("#status").prepend(alert);
    
    // fade in
    alert.fadeIn("slow");
    
    // set a timeout to close the alert
    if (closeDelay)
        window.setTimeout(() => {alert.fadeOut('slow'); }, closeDelay);
    }
}

$.toast = function(message, type, closeDelay) {
    var toast = Object.create(Toast);
    toast.show(message, type, closeDelay);
};
