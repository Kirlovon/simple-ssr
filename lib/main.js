/**
 *  Main library code 
 */

'use strict';

/** Dependencies */
const puppeteer = require('puppeteer');
const logging = require('./infoLogging');

/** Logging setup */
const info = logging.info;
const warn = logging.warning;
const err = logging.error;

module.exports = class {

	constructor() {
		this.browser = undefined;
	}

	/**
	 * Start Puppeteer and prepare SSR for work.
	 * 
	 * @async
	 * @static
	 * @method start
	 * @param {object} [config] Config for puppeteer.launch()
	 * @returns {Promise}
	 */
	static async start(config) {
		
		if (this.browser != undefined) {
			warn(`Puppeteer has already been launched!`);
			await this.stop();
		}

		try {
			this.browser = await puppeteer.launch(config);
		} catch (error) {
			err(`Error starting Puppeteer!`, error);
			throw error;
		}
	}

	/**
	 * Render specified URL.
	 * 
	 * @async
	 * @static
	 * @method render
	 * @param {string} url Render page URL
	 * @param {object} [config] Rendering config
	 * @returns {Promise}
	 */
	static async render(url, config) {}

	/**
	 * Stop Puppeteer.
	 * 
	 * @async
	 * @static
	 * @method stop
	 * @returns {Promise}
	 */
	static async stop() {

		if (this.browser == undefined) {
			warn(`Pupppeteer is not running!`);
		}

		try {
			await (this.browser).close();
			this.browser = undefined;
			info(`Puppeteer closed!`);
		} catch (error) {
			err(`Error closing Puppeteer!`, error);
			throw error;
		}
	}


};