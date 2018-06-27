/**
 *  Main library code 
 */

'use strict';

/** Dependencies */
const puppeteer = require('puppeteer');
const infoLogging = require('./infoLogging');
const cacheManager = require('./cacheManager');
const dataVerification = require('./dataVerification');

/** Logging setup */
const info = infoLogging.info;
const warn = infoLogging.warning;
const err = infoLogging.error;

module.exports = class {

	constructor() {
		this.logs = true;
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

		try {

			// Verify config correctness 
			config = dataVerification.puppeteerConfig(config, this.logs);

			if (this.browser != undefined) {
				if (this.logs) warn(`Puppeteer has already been launched!`);
				await this.stop();
			}

			if (this.logs) warn(`Puppeteer started!`);
			this.browser = await puppeteer.launch(config);

		} catch (error) {
			if (this.logs) err(`Error starting Puppeteer!`, error);
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
	static async render(url, config) {

		try {

			// Verify url correctness 
			url = dataVerification.renderURL(url, this.logs);

			// Verify config correctness 
			config = dataVerification.renderConfig(config, this.logs);

		} catch (error) {
			if (this.logs) err(`Error starting Puppeteer!`, error);
			throw error;
		}
	}

	/**
	 * Stop Puppeteer.
	 * 
	 * @async
	 * @static
	 * @method stop
	 * @returns {Promise}
	 */
	static async stop() {

		try {

			await (this.browser).close();
			this.browser = undefined;

			if (this.browser == undefined && this.logs == true) {
				warn(`Pupppeteer is not running!`);
			} else if (this.logs) {
				info(`Puppeteer closed!`);
			}

		} catch (error) {
			if (this.logs) err(`Error closing Puppeteer!`, error);
			throw error;
		}
	}


};