importScripts('/js/workbox-sw.js');

if (workbox) {
  //workbox.setConfig({debug: true});
  //workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug);
  
  workbox.precaching.precacheAndRoute([]);
 
  /**
   * For third party sites:*/
  
  workbox.routing.registerRoute(new RegExp('^https://use.fontawesome.com/releases/(.*)'),
   workbox.strategies.cacheFirst(),
  );

  workbox.routing.registerRoute(new RegExp('^https://fonts.gstatic.com/(.*)'),
    workbox.strategies.cacheFirst(),
  );
  
  workbox.routing.registerRoute(new RegExp('^https://dev.yellowfortyfour.com:3010/'),
    workbox.strategies.staleWhileRevalidate()
  );


} else {
  console.log('Workbox didn\'t load 😬');
}




