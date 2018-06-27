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

		// Verify config correctness 
		config = dataVerification.puppeteerConfig(config, this.logs);

		try {

			// Check if browser is already launched
			if (this.browser != undefined) {
				if (this.logs) warn(`Puppeteer has already been launched!`);
				await this.stop(); // Close browser
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

		// Verify url correctness 
		url = dataVerification.renderURL(url, this.logs);

		// Verify config correctness 
		config = dataVerification.renderConfig(config, this.logs);

		try {

			// If link not specified
			if (url != undefined) {
				throw 'You must specify URL for rendering!';
			}

			// If cache enabled
			if (config.cache == true) {

				// Delete outdated cache
				cacheManager.cleanCache();

				// Return, if cache finded
				let cached = cacheManager.getCache();
				if (cached != null) {
					if (this.logs) info(`Successfully loaded from cache "${url}"`);
					return {
						html: cached.html,
						cached: true,
						timeout: cached.timeout
					};
				}
			}

			// Rendering start time
			let renderingTimeBEGIN = Date.now();

			// Open new page
			let page = await (this.browser).newPage();

			// Open necessary url
			await page.goto(url, {
				timeout: config.timeout,
				waitUntil: config.waitUntil
			});

			// Wait for selector from domTarget parameter
			if (config.domTarget != null) {
				await page.waitForSelector(config.domTarget, {
					timeout: config.timeout
				});
			}

			// Get content and close page
			let renderedHTML = await page.content();
			await page.close();

			// Get rendering finish time 
			let renderingTimeEND = Date.now();

			// Save cache
			if (config.cache) {
				cacheManager.saveCache(url, renderedHTML, config.cacheTime);
				if (this.logs) info(`Successfully rendered and cached "${url}" ( ${renderingTimeEND - renderingTimeBEGIN} ms )`);
			} else if (this.logs) {
				info(`Successfully rendered "${url}" ( ${renderingTimeEND - renderingTimeBEGIN} ms )`);
			}

			return {
				html: renderedHTML,
				cached: false
			};

		} catch (error) {
			if (this.logs) err(`Error rendering "${url}"`, error);
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

			if (this.browser == undefined && this.logs == true) {
				warn(`Pupppeteer is not running!`);
			} else if (this.logs) {
				info(`Puppeteer closed!`);
			}

			await (this.browser).close();
			this.browser = undefined;

		} catch (error) {
			if (this.logs) err(`Error closing Puppeteer!`, error);
			throw error;
		}
	}


};