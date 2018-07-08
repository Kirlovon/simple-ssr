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

class simpleSSR {

	constructor() {
		this.logs = true; // Enable or Disable logs
		this.safe = true; // Safe mode for preventing errors and simplifying error messages
		this.browser = undefined; // Chromium browser from pupeteer.launch()
		this.cacheManager = cacheManager; // To manually work with the cache
	}

	///////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * Start Puppeteer and prepare SSR for work.
	 * @param {object} [config] Config for puppeteer.launch()
	 * @returns {Promise} 
	 */
	async start(config) {

		// Verify config correctness 
		if (this.safe) config = dataVerification.puppeteerConfig(config, this.logs);

		try {

			// Check if browser is already launched
			if (this.logs && this.browser != undefined) {
				throw new Error('Puppeteer has already been launched before!');
			}

			this.browser = await puppeteer.launch(config);
			if (this.logs) info(`Puppeteer started!`);

		} catch (error) {
			if (this.logs) err(`Error starting Puppeteer!`);
			throw error;
		}
	}

	///////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Render specified URL.
	 * @param {string} url Render page URL
	 * @param {{timeout: number, domTarget: string, waitUntil: string|Array<string>, cache: boolean, cacheTime: number}} [config] Rendering config
	 * @returns {Promise}
	 */
	async render(url, config) {

		// Verify url and config correctness 
		if (this.safe) {
			url = dataVerification.renderURL(url, this.logs);
			config = dataVerification.renderConfig(config, this.logs);
		}

		try {

			// If link not specified
			if (url == undefined && this.safe) {
				throw new Error('URL for rendering is not specified!');
			}

			// If Puppeteer not started
			if (this.browser == undefined && this.safe) {
				await this.start();
				if (this.logs == true) warn(`Recommended to start Puppeteer manually!`);
			}

			// If cache enabled
			if (config.cache == true) {
				cacheManager.cleanCache(); // Delete outdated cache

				// Return, if cache found
				let cached = cacheManager.getCache(url);
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
			try {
				var page = await (this.browser).newPage();
			} catch (error) {
				if (this.safe) {
					throw new Error('Error opening new tab!');
				} else {
					throw error;
				}
			}

			// Open necessary url
			try {
				await page.goto(url, {
					timeout: config.timeout,
					waitUntil: config.waitUntil
				});
			} catch (error) {
				await page.close();
				if (this.safe) {
					throw new Error(`Timed out opening "${url}"!`);
				} else {
					throw error;
				}
			}

			// Wait for selector from domTarget parameter
			try {
				if (config.domTarget != undefined) {
					await page.waitForSelector(config.domTarget, {
						timeout: config.timeout
					});
				}
			} catch (error) {
				await page.close();
				if (this.safe) {
					throw new Error(`Timeout waiting "${config.domTarget}" in "${url}"!`);
				} else {
					throw error;
				}
			}

			// Finish rendering
			try {
				var renderedHTML = await page.content();
			} catch (error) {
				await page.close();
				if (this.safe) {
					throw new Error(`Error getting content from "${url}"!`);
				} else {
					throw error;
				}
			}

			await page.close(); // Close rendered page

			// Rendering finish time 
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
			if (this.logs) err(`Error rendering "${url}"`);
			throw error;
		}
	}

	///////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Stop Puppeteer.
	 * @returns {Promise}
	 */
	async stop() {
		try {

			// Check if Puppeteer is not launched yet
			if (this.browser == undefined && this.safe) {
				throw new Error('Pupppeteer has not been launched yet!');
			}

			await (this.browser).close();
			this.browser = undefined;
			if (this.logs) info(`Puppeteer closed!`);

		} catch (error) {
			if (this.logs) err(`Error closing Puppeteer!`);
			throw error;
		}
	}

	///////////////////////////////////////////////////////////////////////////////////////////////

}

// Export
module.exports = new simpleSSR();