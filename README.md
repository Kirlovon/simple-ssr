<p align="center">
	<img src="https://cdn.rawgit.com/Kirlovon/Simple-SSR/master/logo/Logo.svg" width="256" height="192">
</p>

<p align="center">
	<img src="https://img.shields.io/github/license/Kirlovon/Simple-SSR.svg" alt="License">
	<img src="https://img.shields.io/github/last-commit/Kirlovon/Simple-SSR.svg" alt="Last commit">
	<img src="https://img.shields.io/npm/v/simple-ssr.svg" alt="NPM version">
	<img src="https://img.shields.io/npm/types/simple-ssr.svg" alt="Types">
</p>

## What is it?
Universal server-side rendering implementation for Node.js. Powered by [Puppeteer](https://github.com/GoogleChrome/puppeteer). <br>
This library allows you to preload your web applications on the server side, and send rendered data to the user. <br>

_In simple terms, this module translates this:_
```html
<div id="app"></div>
<script>
	var element = document.getElementById('app');
	element.innerHTML = 'Hello, world!';
</script>
```
_To this:_
```html
<div id="app">Hello, world!</div>
<script>
	var element = document.getElementById('app');
	element.innerHTML = 'Hello, world!';
</script>
```
*Note: The minimum supported Node version is **Node 7.x***<br>

## Features
* Simplifies crawlers work with your **Single Page Applications** or **Progressive Web Apps**.<br>
* Preload your web applications on the server-side. <br>
* Allows you to cache data, optimizing the server-side rendering process. <br>
* In some cases improves performance and loading speed of your web app. <br>
* TypeScript support.

## Installation

Installation from the NPM repository:
```
npm install simple-ssr --save
```

## Example
```javascript
const simpleSSR = require('simple-ssr');

// Puppeteer instance
simpleSSR.browser;

// Enable requests filtering ( Default: true )
simpleSSR.filterRequests = true;

// List of useless for rendering content
simpleSSR.blockedRequest = ['stylesheet', 'image'];

(async() => {

	// Put there Puppeteer config
	await simpleSSR.start({ headless: true });

	let result = await simpleSSR.render('http://example.com/', {
		
		 // Rendering timeout
		timeout: 1000,

		// When to consider navigation succeeded.
		waitUntil: 'load',

		 // DOM target to wait for
		domTarget: ['body', 'h1']
	});

	console.log(result.url) // 'http://example.com/'
	console.log(result.time) // 10000
	console.log(result.html) // '<!DOCTYPE html>...'
	
})();
```
