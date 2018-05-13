module.exports = {
  "globDirectory": "build/",
  "globPatterns": [
    "**/*.{js,css,html,ico,png,jpg,svg}",
    "/"
  ],
  "swDest": "build/ServiceWorker.js",
  "swSrc": "src/browser/ServiceWorker.js",
  "globIgnores": [
    "/api/**/*"
  ]
};