<p align="center">
	<img src="https://cdn.rawgit.com/Kirlovon/Simple-SSR/master/logo/Logo.svg" width="256" height="192">
</p>

<p align="center">
	<a href="https://github.com/Kirlovon/Simple-SSR/blob/master/LICENSE"><img src="https://img.shields.io/github/license/Kirlovon/Simple-SSR.svg" alt="License"></a>
	<a href="https://github.com/Kirlovon/Simple-SSR/blob/master/package.json"><img src="https://img.shields.io/github/package-json/v/Kirlovon/Simple-SSR.svg" alt="Package version"></a>
	<a href="https://github.com/Kirlovon/Simple-SSR/commits/master"><img src="https://img.shields.io/github/last-commit/Kirlovon/Simple-SSR.svg" alt="Last commit"></a>
</p>

Universal server side rendering implementation for Node.js. Powered by [Puppeteer](https://github.com/GoogleChrome/puppeteer).

## Installation

Installation from the GitHub repository:
```
npm install Kirlovon/Simple-SSR --save
```
*Note: The minimum supported Node version is **Node 7.x***

## Example

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