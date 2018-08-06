# 📚 SimpleSSR API 

### Installation
```
npm install Kirlovon/Simple-SSR --save
```

## List of Features
- [simpleSSR.start(config)](#simplessrstartconfig)
- [simpleSSR.render(url, config)](#simplessrrenderurl-config)
- [simpleSSR.stop()](#simplessrstop)
- [simpleSSR.logs](#simplessrlogs)
- [simpleSSR.safe](#simplessrsafe)
- [simpleSSR.browser](#simplessrbrowser)
- [simpleSSR.blockedRequests](#simplessrblockedrequests)
- [simpleSSR.cacheManager.cacheContent](#simplessrcachemanagercache)
- [simpleSSR.cacheManager.getCache(url)](#simplessrcachemanagergetcacheurl)
- [simpleSSR.cacheManager.saveCache(url, data, time)](#simplessrcachemanagersavecacheurl-data-time)
- [simpleSSR.cacheManager.deleteCache(url)](#simplessrcachemanagerdeletecacheurl)
- [simpleSSR.cacheManager.cleanCache()](#simplessrcachemanagercleancache)
- [simpleSSR.cacheManager.resetCache()](#simplessrcachemanagerresetcache)

## API 

---------------------------------------------------------------
### simpleSSR.start(config)
---------------------------------------------------------------
This method start simpleSSR.

#### Parameters
- `config` **{String}** _Config for [puppeteer.launch()](https://github.com/GoogleChrome/puppeteer/blob/v1.6.1/docs/api.md#puppeteerlaunchoptions) ( Optional )_

	_Default puppeteer config:_
	```json
	{
	  headless: true,
	  timeout: 16000,
	  ignoreHTTPSErrors: true
	}
	```

- returns: **{Promise}**
	- **{Promise Resolved}** _Nothing_
	- **{Promise Rejected}** _Throw error message_

##### Example
```javascript
const simpleSSR = require('simple-ssr');

simpleSSR.start({ headless: false }).then(function() {
	console.log('Simple SSR started!');
});
```

---------------------------------------------------------------
### simpleSSR.render(url, config)
---------------------------------------------------------------
Render specified URL. Highly recommended to call [simpleSSR.start(config)](#simplessrstartconfig) before using it.

#### Parameters
- `url` **{String}** _URL to render_
- `config` **{Object}** _Rendering config ( Optional )_ 
	- `timeout` **{Number}** _Loading timeout_
	- `domTarget` **{String}** _DOM element as CSS selector, that will be expected_
	- `waitUntil` **{String or String[]}** _waintUntil from puppeteers [page.goto()](https://github.com/GoogleChrome/puppeteer/blob/v1.6.1/docs/api.md#pagegotourl-options)_
	- `cache` **{Boolean}** _Enable or Disable cache_
	- `cacheTime` **{Number}** _Cache relevance. Set 0, to make cache infinite_

	_Default rendering config:_
	```json
	{
	  timeout: 16000,
	  domTarget: undefined,
	  waitUntil: "networkidle0",
	  cache: false,
	  cacheTime: 30000,
	}
	```

- returns: **{Promise}** 
	- **{Promise Resolved}** _Return **{Object}**_
		- object.`html` **{String}** _Rendered HTML code_
		- object.`cached` **{Boolean}** _True, if rendered HTML taken from cache_
		- object.`renderingTime` **{Number}** _Rendering time in milliseconds_
		
	- **{Promise Rejected}** _Throw error message or puppeteer error_

##### Examples
```javascript
const simpleSSR = require('simple-ssr');

simpleSSR.start().then(function() {
	
	simpleSSR.render('http://example.com/', {
		timeout: 12000,
		cache: false
	}).then(function(data) {
		console.log('example.com successfully rendered!');
		console.log(data.html); // <!DOCTYPE html><html>...
		console.log(data.cached); // false
		console.log(data.renderingTime); // ~1000

		simpleSSR.stop();

	});

});
```
```javascript
const simpleSSR = require('simple-ssr');

(async function() { // Self-executing async function

	await simpleSSR.start();
	
	var rendered = await simpleSSR.render('http://example.com/', {
		cache: true,
		cacheTime: 10000,
	});

	console.log(data.html); // <!DOCTYPE html><html>...
	console.log(data.cached); // true
	console.log(data.renderingTime); // ~1000

	await simpleSSR.stop();

})();
```

---------------------------------------------------------------
### simpleSSR.stop()
---------------------------------------------------------------
This method stop simpleSSR.

#### Parameters
- returns: **{Promise}**
	- **{Promise Resolved}** _Nothing_
	- **{Promise Rejected}** _Throw error message_

##### Example
```javascript
const simpleSSR = require('simple-ssr');

simpleSSR.start({ headless: false }).then(function() {

	console.log('Simple SSR started!');

	simpleSSR.stop().then(function() {
		console.log('Simple SSR stopped!');
	});
});
```

---------------------------------------------------------------
### simpleSSR.logs
---------------------------------------------------------------
This property allows you to enable or disable information logging. _( Default is true )_

##### Example
```javascript
const simpleSSR = require('simple-ssr');

simpleSSR.logs = true; // Enable logs
simpleSSR.logs = false; // Disable logs
```

---------------------------------------------------------------
### simpleSSR.safe
---------------------------------------------------------------
This property allows you to enable or disable safe mode. _( Default is true )_

If safe mode is enabled, the library avoids many errors, warns you of possible errors, 
checks configs, and replaces default error messages with more understandable ones.

##### Example
```javascript
const simpleSSR = require('simple-ssr');

simpleSSR.safe = true; // Enable safe mod
simpleSSR.safe = false; // Disable safe mod
```

---------------------------------------------------------------
### simpleSSR.browser
---------------------------------------------------------------
In this parameter there is a return from [puppeteer.launch()](https://github.com/GoogleChrome/puppeteer/blob/v1.6.2/docs/api.md#puppeteerlaunchoptions).

##### Example
```javascript
const simpleSSR = require('simple-ssr');
const puppeteerBrowser = simpleSSR.browser;

// Take screenshot of github.com and save it as example.png
(async function() {
	var page = await puppeteerBrowser.newPage();
	await page.goto('https://github.com/');
	await page.screenshot({path: 'example.png', fullPage: true});
	await page.close();
})();
```

---------------------------------------------------------------
### simpleSSR.blockedRequests
---------------------------------------------------------------
Blocked requests list. Allows you to block loading of unnecessary resources, such as images, sounds, styles, etc. 
More information [here](https://github.com/GoogleChrome/puppeteer/blob/v1.6.2/docs/api.md#requestresourcetype).

_Default: `['stylesheet', 'image', 'media', 'font', 'manifest']`_

##### Example
```javascript
const simpleSSR = require('simple-ssr');

// Block only images and styles
simpleSSR.blockedRequests = ['stylesheet', 'image'];
```

---------------------------------------------------------------
### simpleSSR.cacheManager.cache
---------------------------------------------------------------
Contains an associative array ( [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) ), which stores all cached data. Allows you to manually work with the cache.

##### Example
```javascript
const simpleSSR = require('simple-ssr');
const cache = simpleSSR.cacheManager.cache;

console.log(cache.size); // Log number of elements in array
```

---------------------------------------------------------------
### simpleSSR.cacheManager.getCache(url)
---------------------------------------------------------------
This method returns object with cached data.

#### Parameters
- `url` **{String}** _URL of rendered page_
- returns: **{Object}**
	- object.`html` **{String}** _Rendered HTML code_
	- object.`timeout` **{Number}** _Time in milliseconds, through which the cache will expire( 0 if cache eternal )_

##### Example
```javascript
const simpleSSR = require('simple-ssr');
const cache = simpleSSR.cacheManager.cache;

// Get cached data of rendered example.com
let data = cache.getCache('http://example.com/'); 

console.log(data.html); // <!DOCTYPE html><html>...
console.log(data.timeout); // ~1533000000000
```

---------------------------------------------------------------
### simpleSSR.cacheManager.saveCache(url, data, time)
---------------------------------------------------------------
Allows you to save manualy new cached data.

#### Parameters
- `url` **{String}** _URL of rendered page_
- `data` **{String}** _Rendered HTML code_ 
- `time` **{Number}** _Time in milliseconds, through which the cache will expire ( Set 0, to create eternal cache )_

##### Example
```javascript
const simpleSSR = require('simple-ssr');
const cache = simpleSSR.cacheManager.cache;

// Save new ethernal cache
cache.saveCache('http://example.com/', 'SOME HTML CODE', 0); 
```

---------------------------------------------------------------
### simpleSSR.cacheManager.deleteCache(url)
---------------------------------------------------------------
Allows you to delete cached page data manualy.

#### Parameters
- `url` **{String}** _URL of the page to delete_

##### Example
```javascript
const simpleSSR = require('simple-ssr');
const cache = simpleSSR.cacheManager.cache;

// Delete cache of example.com
cache.deleteCache('http://example.com/'); 
```

---------------------------------------------------------------
### simpleSSR.cacheManager.cleanCache()
---------------------------------------------------------------
Allows you to delete all outdated cache manualy.

##### Example
```javascript
const simpleSSR = require('simple-ssr');
const cache = simpleSSR.cacheManager.cache;

// Delete all outdated cache
cache.cleanCache(); 
```

---------------------------------------------------------------
### simpleSSR.cacheManager.resetCache()
---------------------------------------------------------------
Allows you to delete all cached data manualy.

##### Example
```javascript
const simpleSSR = require('simple-ssr');
const cache = simpleSSR.cacheManager.cache;

// Delete all cache
cache.resetCache(); 
```
