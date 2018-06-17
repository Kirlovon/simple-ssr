/**
 *  Main library code 
 */

'use strict';
const puppeteer = require('puppeteer');

module.exports = class {
	
	constructor() {
		this.browser = undefined;
	}

	/**
	 * Start Puppeteer and prepare SSR for work.
	 * @param {object} [config] - Config for puppeteer.launch()
	 * @returns {Promise}
	 */
	static async start(config) {}

	/**
	 * Render specified URL.
	 * @param {string} url - Render page URL
	 * @param {object} [config] - Rendering config
	 * @returns {Promise}
	 */
	static async render(url, config) {}

	/**
	 * Stop Puppeteer.
	 * @returns {Promise}
	 */
	static async stop() {}


};