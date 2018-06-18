/**
 * Simple-SSR
 * 
 * @module simple-ssr
 * @author Kirlovon
 * @license MIT
 * @version 0.0.1
 */

'use strict';

/** Main dependency */
const main = require('./lib/main');

module.exports = class {

	/**
	 * Start Puppeteer and prepare SSR for work.
	 * 
	 * @static
	 * @method start
	 * @param {object} [config] Config for puppeteer.launch()
	 * @returns {Promise}
	 */
	static start(config) {
		return main.start(config);
	}

	/**
	 * Render specified URL.
	 * 
	 * @static
	 * @method render
	 * @param {string} url Render page URL
	 * @param {object} [config] Rendering config
	 * @returns {Promise}
	 */
	static render(url, config) {
		return main.render(url, config);
	}

	/**
	 * Stop Puppeteer.
	 * 
	 * @static
	 * @method stop
	 * @returns {Promise}
	 */
	static stop() {
		return main.stop();
	}

};