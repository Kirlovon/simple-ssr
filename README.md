<p align="center">
	<img src="https://cdn.rawgit.com/Kirlovon/Simple-SSR/master/logo/Logo.svg" width="256" height="192">
</p>

<p align="center">
	<a href="https://ci.appveyor.com/project/Kirlovon/simple-ssr"><img src="https://ci.appveyor.com/api/projects/status/fkm8h7gbncv0fj28/branch/dev?svg=true" alt="AppVeyor"></a>
	<a href="https://github.com/Kirlovon/Simple-SSR/blob/master/LICENSE"><img src="https://img.shields.io/github/license/Kirlovon/Simple-SSR.svg" alt="License"></a>
	<a href="https://github.com/Kirlovon/Simple-SSR/commits/master"><img src="https://img.shields.io/github/last-commit/Kirlovon/Simple-SSR.svg" alt="Last commit"></a>
	<a href="https://github.com/Kirlovon/Simple-SSR/blob/master/package.json"><img src="https://img.shields.io/github/package-json/v/Kirlovon/Simple-SSR.svg" alt="Package version"></a>
	<img src="https://img.shields.io/npm/types/chalk.svg">
</p>

## What is it?
Universal server-side rendering implementation for Node.js. Powered by [Puppeteer](https://github.com/GoogleChrome/puppeteer). <br>
This library allows you to preload your web applications on the server side, and send rendered data to the user.  <br>

*Note: The minimum supported Node version is **Node 7.x***<br>
*Note 2: If you use TypeScript, you must enable **esModuleInterop** inside tsconfig*


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

## Usage

### [API Documentation](https://github.com/Kirlovon/Simple-SSR/blob/master/API.md)

### Example
```javascript
const express = require('express');
const simpleSSR = require('simple-ssr');
const app = express();

app.get('/', async (req, res) => {
	let rendered = await simpleSSR.render('http://example.com/');
	res.send(rendered.html);
});

simpleSSR.start().then(() => {
	app.listen(3000);
});
```