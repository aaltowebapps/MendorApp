MendorApp
=========

Mendor Web App

Desktop version
---------------

* src/MendorApp/MendorGraphicsView_Raphael.html - A HTML5 Canvas version of the graph
* Use "chrome.exe --disable-web-security" to use Mendor API to fetch data, or modify
  "useDumpData: true" in file src/MendorApp/MendorGraphicsView_Raphael.html (line 45) to use
  dumped data.
* Select start date around 25.08.2011 and end date around 05.10.2011 to get data
  from Mendor server.  

Mobile version
--------------

* src/index.html - jQuery Mobile version with a list view of the measurement pairs
* Use "chrome.exe --disable-web-security" to use Mendor API to fetch data
* OR use a PHP server and index_proxy.html to use Simple PHP Proxy to avoid CORS problems
